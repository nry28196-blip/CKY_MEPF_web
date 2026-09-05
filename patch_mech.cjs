const fs = require('fs');

let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

const calculateCoolingLoadReplacement = `  const calculateCoolingLoad = () => {
    const numArea = area !== '' && area !== undefined ? Number(area) : NaN;
    const numOccupants = occupants !== '' && occupants !== undefined ? Number(occupants) : NaN;
    const numHeight = height !== '' && height !== undefined ? Number(height) : NaN;
    
    if (isNaN(numArea) || isNaN(numOccupants) || isNaN(numHeight)) {
      return {
        status: 'INCOMPLETE',
        warning: 'Missing or invalid required geometry/occupancy parameters.',
        peopleSensible: 0, peopleLatent: 0, lightingSensible: 0, equipmentSensible: 0,
        wallSensible: 0, roofSensible: 0, windowCondSensible: 0, solarSensible: 0,
        ventSensible: 0, ventLatent: 0, infiltrationSensible: 0, infiltrationLatent: 0, 
        totalSensible: 0, totalLatent: 0,
        calculatedTotal: 0, finalTotal: 0,
        watts: 0, btu: 0, tons: 0
      };
    }
    const status = 'PASS';

    // 1. Convert User Inputs to Canonical Metric
    const canonicalArea = isMetric ? numArea : UnitConversionService.sqftToSqM(numArea);
    const canonicalVolume = estimationBasis === 'volume' 
      ? (isMetric ? (volume !== '' ? Number(volume) : NaN) : UnitConversionService.cuFtToCuM(volume !== '' ? Number(volume) : NaN))
      : (canonicalArea * numHeight);
    
    const altMeters = isMetric ? altitude : UnitConversionService.ftToM(altitude);
    const canonicalVentLps = isMetric ? ventilationLps : UnitConversionService.cfmToLs(ventilationLps);

    // Hardcoded environmental state (already metric)
    const dT = outdoorTemp - indoorTemp; 

    // 1. People
    const peopleSensible = numOccupants * sensiblePerPerson;
    const peopleLatent = numOccupants * latentPerPerson;
    
    // 2. Lighting
    const lightingSensible = canonicalArea * lightingWpm2;
    
    // 3. Equipment
    const equipmentSensible = equipmentWatts;
    
    // 4. Envelope (Walls, Roof, Window Conduction)
    const wallSensible = wallArea * wallUValue * dT;
    const roofSensible = roofArea * roofUValue * dT;
    const windowCondSensible = windowArea * windowUValue * dT;
    
    // 5. Solar (Window SHGC)
    const solarIrradiance = 400; // Peak solar irradiance assumption W/m2
    const solarSensible = windowArea * windowShgc * solarIrradiance;
    
    // 6. Ventilation (Sensible & Latent)
    const outdoorProps = AirDensityService.getAirProperties(altMeters, outdoorTemp, relativeHumidity);
    const indoorProps = AirDensityService.getAirProperties(altMeters, indoorTemp, indoorRelativeHumidity);
    
    const densityRatio = useAltitudeAdj ? outdoorProps.densityRatio : 1.0;
    const actualAirDensity = useAltitudeAdj ? outdoorProps.densityKgM3 : outdoorProps.standardDensityKgM3;
    
    const dw = Math.max(0, outdoorProps.humidityRatioKgKg - indoorProps.humidityRatioKgKg);
    const cpAir = 1.026 * actualAirDensity; 
    const hfgVapor = 2501 * actualAirDensity; 
    
    const ventM3s = canonicalVentLps / 1000;
    const ventSensible = (cpAir * ventM3s * dT) * 1000; 
    const ventLatent = (hfgVapor * ventM3s * dw) * 1000; 
    
    // 7. Infiltration
    const infiltrationM3s = (infiltrationACH * canonicalVolume) / 3600;
    const infiltrationSensible = (cpAir * infiltrationM3s * dT) * 1000;
    const infiltrationLatent = (hfgVapor * infiltrationM3s * dw) * 1000;

    const totalSensible = peopleSensible + lightingSensible + equipmentSensible + wallSensible + roofSensible + windowCondSensible + solarSensible + ventSensible + infiltrationSensible;
    const totalLatent = peopleLatent + ventLatent + infiltrationLatent;
    const calculatedTotal = totalSensible + totalLatent;
    const finalTotal = calculatedTotal * (1 + safetyFactor / 100);

    return {
      peopleSensible, peopleLatent, lightingSensible, equipmentSensible,
      wallSensible, roofSensible, windowCondSensible, solarSensible,
      ventSensible, ventLatent, infiltrationSensible, infiltrationLatent, 
      totalSensible, totalLatent,
      calculatedTotal, finalTotal,
      watts: finalTotal,
      btu: finalTotal * 3.412142,
      tons: finalTotal / 3516.85284,
      status
    };
  };`;

code = code.replace(/const calculateCoolingLoad = \(\) => \{[\s\S]*?status\n\s*\};\n\s*\};/, calculateCoolingLoadReplacement);

const calcRoomReplacement = `  const calcRoomTonsAndWatts = (basis: 'area' | 'volume', size: number, occupants: number) => {
    const canonicalSize = isMetric 
      ? size 
      : (basis === 'area' ? UnitConversionService.sqftToSqM(size) : UnitConversionService.cuFtToCuM(size));
      
    const watts = (basis === 'area' ? canonicalSize * baseLoadPerSqm : canonicalSize * baseLoadPerCum) + (occupants * loadPerPerson);
    const btu = watts * 3.412142;
    const tons = btu / 12000;
    return { watts, tons };
  };`;

code = code.replace(/const calcRoomTonsAndWatts = \(basis: 'area' \| 'volume', size: number, occupants: number\) => \{[\s\S]*?return \{ watts, tons \};\n\s*\};/, calcRoomReplacement.trim());

// We need to import UnitConversionService if it's not already imported in MechanicalCalc.tsx
if (!code.includes('UnitConversionService')) {
  code = code.replace(
    "import { AirDensityService } from '../calculations/services/AirDensityService';",
    "import { AirDensityService } from '../calculations/services/AirDensityService';\nimport { UnitConversionService } from '../calculations/services/UnitConversionService';"
  );
}

// There is one more place where UnitConversion is missing in the UI:
// The display for altitude density ratio uses \`altitude * 0.3048\`
code = code.replace(/isMetric \? altitude : altitude \* 0\.3048/g, 'isMetric ? altitude : UnitConversionService.ftToM(altitude)');

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
