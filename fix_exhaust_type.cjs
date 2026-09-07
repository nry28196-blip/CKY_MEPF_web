const fs = require('fs');

let content = fs.readFileSync('src/tests/ventilation/exhaust-calculations.test.ts', 'utf8');

const replacement = `exhaustClass: 2,
      name: 'Test',
      operatingCondition: 'continuous',
      reference: 'Table 6.5',
      edition: '2025',
      revision: ''`;

content = content.replace(/exhaustClass: 2/g, replacement);

fs.writeFileSync('src/tests/ventilation/exhaust-calculations.test.ts', content);
