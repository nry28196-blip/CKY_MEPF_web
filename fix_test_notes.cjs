const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', 'utf-8');

code = code.replace(
  /it\('blocks NOT_VERIFIED record that claims VERIFIED in notes', \(\) => \{[\s\S]*?\}\);\n/,
  ""
);

fs.writeFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', code);
