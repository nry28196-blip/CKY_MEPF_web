const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// 1. Add indoorRelativeHumidity state
code = code.replace(
  "const [relativeHumidity, setRelativeHumidity] = useState<number>(50);",
  "const [relativeHumidity, setRelativeHumidity] = useState<number>(50);\n  const [indoorRelativeHumidity, setIndoorRelativeHumidity] = useState<number>(50);"
);

// 2. Fix the calculation block
const calcBlockRegex = /\/\/ 6\. Ventilation \(Sensible & Latent\)[\s\S]*?const finalTotal = calculatedTotal \* \(1 \+ safetyFactor \/ 100\);/m;

const newCalcBlock = `// 6. Ventilation (Sensible & Latent)
    // Psychrometric state calculations
    const altMeters = isMetric ? altitude : altitude * 0.3048;
    
    // Explicit psychrometric calculations for both states
    const outdoorProps = AirDensityService.getAirProperties(altMeters, outdoorTemp, relativeHumidity);
    const indoorProps = AirDensityService.getAirProperties(altMeters, indoorTemp, indoorRelativeHumidity);
    
    const densityRatio = useAltitudeAdj ? outdoorProps.densityRatio : 1.0;
    const actualAirDensity = useAltitudeAdj ? outdoorProps.densityKgM3 : outdoorProps.standardDensityKgM3;
    
    // Calculate dw based on actual psychrometric state
    const dw = Math.max(0, outdoorProps.humidityRatioKgKg - indoorProps.humidityRatioKgKg);
    
    // Specific heat of dry air ~ 1006 J/kgK + vapor contribution. Simplification: 1026 J/kgK for moist air.
    const cpAir = 1.026 * actualAirDensity; // kJ/s (kW) per m3/s per K
    const hfgVapor = 2501 * actualAirDensity; // kJ/kg -> kW per (kg/s) -> using air density to get volumetric coefficient
    
    // Convert flow to m3/s for SI calculation
    const ventM3s = ventilationLps / 1000;
    const ventSensible = (cpAir * ventM3s * dT) * 1000; // Convert kW to Watts
    const ventLatent = (hfgVapor * ventM3s * dw) * 1000; // Convert kW to Watts
    
    // 7. Infiltration
    const numVolume = numArea * height;
    const infiltrationM3s = (infiltrationACH * numVolume) / 3600;
    const infiltrationSensible = (cpAir * infiltrationM3s * dT) * 1000;
    const infiltrationLatent = (hfgVapor * infiltrationM3s * dw) * 1000;

    const totalSensible = peopleSensible + lightingSensible + equipmentSensible + wallSensible + roofSensible + windowCondSensible + solarSensible + ventSensible + infiltrationSensible;
    const totalLatent = peopleLatent + ventLatent + infiltrationLatent;
    const calculatedTotal = totalSensible + totalLatent;
    const finalTotal = calculatedTotal * (1 + safetyFactor / 100);`;

code = code.replace(calcBlockRegex, newCalcBlock);

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Patched MechanicalCalc psychrometrics");
