import fs from 'fs';
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/status = 'NOT_VERIFIED';/g, "status = 'BLOCKED';");
content = content.replace(/status = reasons\.includes\('Missing Reference'\) \? 'NOT_VERIFIED' : 'INCOMPLETE';/g, "status = reasons.includes('Missing Reference') ? 'BLOCKED' : 'INCOMPLETE';");
content = content.replace(/status = reasons\.includes\('Missing Ez Reference'\) \? 'NOT_VERIFIED' : 'INCOMPLETE';/g, "status = reasons.includes('Missing Ez Reference') ? 'BLOCKED' : 'INCOMPLETE';");

fs.writeFileSync(file, content);
