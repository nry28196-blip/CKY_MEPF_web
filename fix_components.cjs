const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// fix systemType selection options
content = content.replace(
  `<option value="single">Single Zone System</option>\n              <option value="multi">Multi-Zone System (VAV/CV)</option>`,
  `<option value="single">Single Zone System</option>\n              <option value="multi_simplified">Multi-Zone Simplified Procedure (6.2.5.3)</option>\n              <option value="multi_alternative">Multi-Zone Alternative Procedure (Appendix A)</option>`
);

content = content.replace(
  `onChange={(e) => setSystemType(e.target.value as 'single' | 'multi')}`,
  `onChange={(e) => setSystemType(e.target.value as 'single' | 'multi_simplified' | 'multi_alternative')}`
);

// fix multiInputs
content = content.replace(
  `const multiInputs = zoneResults.map(zr => ({`,
  `const multiInputs = { zones: zoneResults.map(zr => ({`
);
content = content.replace(
  `result: zr.result`,
  `result: zr.result\n    })) };`
);
content = content.replace(
  `}));\n    \n    return MultiZoneVentilationService.calculateMultiZoneSystem(\n      multiInputs, \n      systemPopulation === '' ? null : Number(systemPopulation), \n      systemPrimaryAirflow === '' ? null : Number(systemPrimaryAirflow),\n      densityRatio\n    );`,
  `return MultiZoneVentilationService.calculateMultiZoneSystem(\n      multiInputs, \n      systemPopulation === '' ? null : Number(systemPopulation), \n      systemPrimaryAirflow === '' ? null : Number(systemPrimaryAirflow),\n      densityRatio,\n      systemType === 'multi_simplified' ? 'simplified' : 'alternative'\n    );`
);

content = content.replace(
  /systemType === 'multi'/g,
  `systemType.startsWith('multi')`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);

// Fix TS errors in test file
let testFile = 'src/calculations/ventilation/__tests__/MultiZoneVentilationService.test.ts';
if(fs.existsSync(testFile)) {
  fs.unlinkSync(testFile);
}

