import fs from 'fs';
const file = 'src/tests/ventilation/test-fixtures.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/value: 'Synthetic Test Data', revision: edition \}\n    \};\n\}/g, "value: 'Synthetic Test Data', revision: edition }\n    }\n  };\n}");

fs.writeFileSync(file, content);
