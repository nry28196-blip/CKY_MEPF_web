const fs = require('fs');

const fixCalc = () => {
  let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');
  code = code.replace(/zone: \{\n\s*spaceType,/g, "zone: {\n          expectedStandard: 'ASHRAE 62.1',\n          expectedEdition: edition,\n          spaceType,");
  fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
};

const fixGolden = () => {
  let code = fs.readFileSync('src/tests/ventilation/golden.test.ts', 'utf-8');
  code = code.replace(/spaceType: /g, "expectedStandard: 'ASHRAE 62.1',\n      expectedEdition: '2025',\n      spaceType: ");
  fs.writeFileSync('src/tests/ventilation/golden.test.ts', code);
};

fixCalc();
fixGolden();
