import fs from 'fs';

const filePath = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("if (prov.verificationStatus !== 'VERIFIED' && parent.verificationStatus === 'VERIFIED') return false; // Added this one as well just in case, but let's stick to prompt exactly:", "");

fs.writeFileSync(filePath, content);
