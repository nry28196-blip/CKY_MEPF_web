const fs = require('fs');
let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// We need to carefully replace the manual calculations with imports from VentilationEngine.ts.
// First, add the import to the top if not present
if (!content.includes('MechanicalCoolingEngine')) {
  content = content.replace(
    "import { DensityCorrectionService } from '../lib/DensityCorrectionService';",
    "import { DensityCorrectionService } from '../lib/DensityCorrectionService';\nimport { MechanicalCoolingEngine } from '../lib/VentilationEngine';"
  );
}

// Remove the constants and calcRoomTonsAndWatts
content = content.replace(
  /  const baseLoadPerSqm = 150;\n  const baseLoadPerCum = 50;\n  const loadPerPerson = 100;\n\n  \/\/ VRF state variables/g,
  "  // VRF state variables"
);

content = content.replace(
  /  const calcRoomTonsAndWatts = \(basis: 'area' \| 'volume', size: number, occupants: number\) => \{\n[\s\S]*?return \{ watts, tons \};\n  \};\n/g,
  ""
);

content = content.replace(
  /\.\.\.calcRoomTonsAndWatts\('area', 35, 3\)/g,
  "...MechanicalCoolingEngine.calcRoomTonsAndWatts('area', 35, 3, isMetric)"
);
content = content.replace(
  /\.\.\.calcRoomTonsAndWatts\('area', 150, 18\)/g,
  "...MechanicalCoolingEngine.calcRoomTonsAndWatts('area', 150, 18, isMetric)"
);
content = content.replace(
  /\.\.\.calcRoomTonsAndWatts\('area', 45, 12\)/g,
  "...MechanicalCoolingEngine.calcRoomTonsAndWatts('area', 45, 12, isMetric)"
);
content = content.replace(
  /\.\.\.calcRoomTonsAndWatts\('area', 30, 4\)/g,
  "...MechanicalCoolingEngine.calcRoomTonsAndWatts('area', 30, 4, isMetric)"
);

// Replace calculateCoolingLoad
content = content.replace(
  /  const calculateCoolingLoad = \(\) => \{\n    const numArea = area[\s\S]*?status\n    \};\n  \};\n\n  const results = calculateCoolingLoad\(\);/g,
  `  const results = MechanicalCoolingEngine.calculateCoolingLoad({
    isMetric, area, volume, height, estimationBasis, occupants,
    ventilationLps, outdoorTemp, indoorTemp, indoorRelativeHumidity, relativeHumidity,
    altitude, useAltitudeAdj, sensiblePerPerson, latentPerPerson,
    lightingWpm2, equipmentWatts, wallArea, wallUValue, roofArea, roofUValue,
    windowArea, windowUValue, windowShgc, infiltrationACH, safetyFactor
  });`
);

// Replace getVrfCalculations
content = content.replace(
  /  const getVrfCalculations = \(\) => \{\n    let totalConnectedTons[\s\S]*?baseOduCharge, totalCharge\n    \};\n  \};\n\n  const vrfResults = getVrfCalculations\(\);/g,
  `  const vrfResults = MechanicalCoolingEngine.calculateVrfSystem({
    rooms: vrfRooms,
    isMetric,
    diversityFactor,
    isOduAuto,
    customOduHp,
    refrigerantType,
    pipingLength
  });`
);


// Replace new room addition calculation
content = content.replace(
  /                            \.\.\.calcRoomTonsAndWatts\(newRoomBasis, size, occupantsCount\)/g,
  "                            ...MechanicalCoolingEngine.calcRoomTonsAndWatts(newRoomBasis, size, occupantsCount, isMetric)"
);

// Check if there are other calcRoomTonsAndWatts being passed as props
content = content.replace(
  /calcRoomTonsAndWatts=\{calcRoomTonsAndWatts\}/g,
  "calcRoomTonsAndWatts={(basis, size, occupants) => MechanicalCoolingEngine.calcRoomTonsAndWatts(basis, size, occupants, isMetric)}"
);


fs.writeFileSync('src/components/MechanicalCalc.tsx', content);
