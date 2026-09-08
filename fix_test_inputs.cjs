const fs = require('fs');

const fixFile = (file) => {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/spaceType: /g, "expectedStandard: 'ASHRAE 62.1',\n      expectedEdition: '2025',\n      spaceType: ");
  fs.writeFileSync(file, code);
};

fixFile('src/tests/ventilation/Ventilation.test.ts');
fixFile('src/tests/ventilation/ashrae-621-zone.test.ts');
fixFile('src/tests/ventilation/golden.test.ts');
fixFile('src/tests/ventilation/ashrae-621-numerical.test.ts');
