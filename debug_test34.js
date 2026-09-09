import fs from 'fs';
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/let status: ValidationStatus = 'PASS';/, `let status: ValidationStatus = 'PASS';
    if (!valid && ezConfig.edition === '2022') {
       require('fs').writeFileSync('t34_reasons.log', JSON.stringify(reasons));
    }
`);
fs.writeFileSync(file, content);
