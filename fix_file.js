import fs from 'fs';
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/let status: ValidationStatus = 'PASS';\n    if \(\!valid && ezConfig.edition === '2022'\) \{\n       require\('fs'\).writeFileSync\('t34_reasons.log', JSON.stringify\(reasons\)\);\n    \}/g, "let status: ValidationStatus = 'PASS';");
fs.writeFileSync(file, content);
