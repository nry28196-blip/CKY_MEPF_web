const fs = require('fs');

const files = [
  'src/tests/ventilation/exhaust-provenance.test.ts',
  'src/tests/ventilation/exhaust-calculations.test.ts',
  'src/tests/ventilation/test-fixtures.ts'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/verificationDate: ''/g, "verificationDate: '2025-01-01'");
  fs.writeFileSync(file, code);
}

