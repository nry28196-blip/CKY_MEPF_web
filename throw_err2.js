import fs from 'fs';
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/if \(\!valid && ezConfig.edition === '2022'\) \{\n       console.error\("DEBUG TEST 34 REASONS:", reasons\);\n    \}/g, '');
fs.writeFileSync(file, content);
