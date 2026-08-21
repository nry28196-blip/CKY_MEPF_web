const fs = require('fs');
const content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// 1. Find state variables block
const stateStartMarker = "const [estimationBasis, setEstimationBasis] = useState<'area' | 'volume'>('area');";
const stateEndMarker = "  // Constants";
// Replace this block with new state

let newContent = content.replace(
  new RegExp(stateStartMarker + "[\\s\\S]*?" + stateEndMarker),
  `// --- NEW ADVANCED ASHRAE STATE ---
  const [outdoorTemp, setOutdoorTemp] = useState<number>(35);
  const [indoorTemp, setIndoorTemp] = useState<number>(24);
  const [area, setArea] = useState<number>(50);
  const [height, setHeight] = useState<number>(3);
  const [occupants, setOccupants] = useState<number>(5);
  const [sensiblePerPerson, setSensiblePerPerson] = useState<number>(75);
  const [latentPerPerson, setLatentPerPerson] = useState<number>(55);
  const [lightingWpm2, setLightingWpm2] = useState<number>(12);
  const [equipmentWatts, setEquipmentWatts] = useState<number>(500);
  const [wallArea, setWallArea] = useState<number>(40);
  const [wallUValue, setWallUValue] = useState<number>(2.0);
  const [roofArea, setRoofArea] = useState<number>(50);
  const [roofUValue, setRoofUValue] = useState<number>(0.5);
  const [windowArea, setWindowArea] = useState<number>(10);
  const [windowUValue, setWindowUValue] = useState<number>(3.0);
  const [windowShgc, setWindowShgc] = useState<number>(0.6);
  const [ventilationLps, setVentilationLps] = useState<number>(25);
  const [infiltrationACH, setInfiltrationACH] = useState<number>(0.5);
  const [safetyFactor, setSafetyFactor] = useState<number>(10);
  
  // Legacy states kept for VRF compatibility
  const [estimationBasis, setEstimationBasis] = useState<'area' | 'volume'>('area');
  const [volume, setVolume] = useState<number | ''>(150);
  const [chartMode, setChartMode] = useState<'bar' | 'pie'>('pie');
  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Constants`
);

// 2. Replace calculation engine
const calcStart = "const calculateCoolingLoad = () => {";
const calcEnd = "const results = calculateCoolingLoad();";

newContent = newContent.replace(
  new RegExp(calcStart + "[\\s\\S]*?" + calcEnd),
  `const calculateCoolingLoad = () => {
    const dT = outdoorTemp - indoorTemp;

    // 1. People
    const peopleSensible = occupants * sensiblePerPerson;
    const peopleLatent = occupants * latentPerPerson;
    
    // 2. Lighting
    const lightingSensible = area * lightingWpm2;
    
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
    const ventSensible = 1.21 * ventilationLps * dT;
    // Latent assumption: outdoor humidity ratio approx 0.016, indoor 0.009 -> dw = 0.007
    const dw = 0.007; 
    const ventLatent = 3010 * ventilationLps * dw;
    
    // 7. Infiltration
    const volume = area * height;
    const infiltrationLps = (infiltrationACH * volume * 1000) / 3600;
    const infiltrationSensible = 1.21 * infiltrationLps * dT;
    const infiltrationLatent = 3010 * infiltrationLps * dw;

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
      tons: finalTotal / 3516.85284
    };
  };

  const results = calculateCoolingLoad();`
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', newContent);
console.log('Calculation replaced.');
