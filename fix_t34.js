import fs from 'fs';
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/if \(\!valid && ezConfig\.edition === '2022'\) \{\n       require\('fs'\)\.writeFileSync\('t34_reasons\.log', JSON\.stringify\(reasons\)\);\n    \}/, "");

fs.writeFileSync(file, content);
