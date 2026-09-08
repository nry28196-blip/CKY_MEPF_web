const fs = require('fs');

let code = fs.readFileSync('src/tests/ventilation/golden.test.ts', 'utf-8');
code = code.replace(/id: 'zone-1',\n        spaceType/g, "id: 'zone-1',\n        expectedStandard: 'ASHRAE 62.1',\n        expectedEdition: '2025',\n        spaceType");
code = code.replace(/id: 'zone-2',\n        spaceType/g, "id: 'zone-2',\n        expectedStandard: 'ASHRAE 62.1',\n        expectedEdition: '2025',\n        spaceType");
code = code.replace(/zone: \{\n        spaceType/g, "zone: {\n        expectedStandard: 'ASHRAE 62.1',\n        expectedEdition: '2025',\n        spaceType");
fs.writeFileSync('src/tests/ventilation/golden.test.ts', code);

