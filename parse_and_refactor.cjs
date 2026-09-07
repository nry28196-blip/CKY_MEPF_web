const fs = require('fs');

let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// The best way to strip functions is using index slicing
// 1. Remove calculateCoolingLoad
let match1 = content.match(/const calculateCoolingLoad = \(\) => \{[\s\S]*?return \{[\s\S]*?status\n    \};\n  \};\n/);
if (match1) {
  content = content.replace(match1[0], '');
}

// 2. Replace results declaration
content = content.replace(/const results = calculateCoolingLoad\(\);/, `const results = MechanicalCoolingEngine.calculateCoolingLoad({
    isMetric, area, volume, height, estimationBasis, occupants,
    ventilationLps, outdoorTemp, indoorTemp, indoorRelativeHumidity, relativeHumidity,
    altitude, useAltitudeAdj, sensiblePerPerson, latentPerPerson,
    lightingWpm2, equipmentWatts, wallArea, wallUValue, roofArea, roofUValue,
    windowArea, windowUValue, windowShgc, infiltrationACH, safetyFactor
  });`);

// 3. Remove getVrfCalculations
let match2 = content.match(/const getVrfCalculations = \(\) => \{[\s\S]*?totalCharge\n    \};\n  \};\n/);
if (match2) {
  content = content.replace(match2[0], '');
}

// 4. Replace vrfResults declaration
content = content.replace(/const vrfResults = getVrfCalculations\(\);/, `const vrfResults = MechanicalCoolingEngine.calculateVrfSystem({
    rooms: vrfRooms,
    isMetric,
    diversityFactor,
    isOduAuto,
    customOduHp,
    refrigerantType,
    pipingLength
  });`);

// 5. Remove calcRoomTonsAndWatts
let match3 = content.match(/const calcRoomTonsAndWatts = \(basis: 'area' \| 'volume', size: number, occupants: number\) => \{[\s\S]*?return \{ watts, tons \};\n  \};\n/);
if (match3) {
  content = content.replace(match3[0], '');
}

fs.writeFileSync('src/components/MechanicalCalc.tsx', content);

