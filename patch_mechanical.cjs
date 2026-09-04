const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf-8');

// 1. In calculateCoolingLoad, replace the || 0 stuff
code = code.replace(
  /const numArea = Number\(area\) \|\| 0;\n\s*const numOccupants = Number\(occupants\) \|\| 0;/,
  `const numArea = area !== '' && area !== undefined ? Number(area) : NaN;
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
    }`
);

// We must also fix height usage.
code = code.replace(
  /const numVolume = numArea \* height;/,
  `const numVolume = numArea * numHeight;`
);

// We should also replace the results display so it handles INCOMPLETE.
// Instead of modifying 50 instances of || 0, maybe we can conditionally render the whole results grid
// but for now let's just make a small helper function in the component or globally.
// Actually, let's just replace all || 0 and || 1 in the JSX with a safe display mechanism.
// Or wait, if `results.status === 'INCOMPLETE'`, maybe we shouldn't show the grid, or we show dashes.
