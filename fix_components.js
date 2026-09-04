const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');
content = content.replace(
  `    const multiInputs = zoneResults.map(zr => ({`,
  `    const multiInputs = { zones: zoneResults.map(zr => ({`
);
content = content.replace(
  `      result: zr.result`,
  `      result: zr.result\n    })) };`
);
content = content.replace(
  `    }));`,
  ``
);
content = content.replace(
  `      multiInputs, \n      systemPopulation === '' ? null : Number(systemPopulation), \n      systemPrimaryAirflow === '' ? null : Number(systemPrimaryAirflow),\n      densityRatio\n    );`,
  `      multiInputs, \n      systemPopulation === '' ? null : Number(systemPopulation), \n      systemPrimaryAirflow === '' ? null : Number(systemPrimaryAirflow),\n      densityRatio,\n      systemType === 'multi_simplified' ? 'simplified' : 'alternative'\n    );`
);

content = content.replace(
  `systemType === 'multi'`,
  `systemType.startsWith('multi')`
);
// I already replaced some in sed, let me double check where `systemType === 'multi'` occurs.
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
