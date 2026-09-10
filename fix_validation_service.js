import fs from 'fs';
const file = 'src/calculations/ventilation/VentilationValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("export type ValidationStatus = 'PASS' | 'WARNING' | 'INCOMPLETE' | 'FAIL' | 'NOT_EVALUATED' | 'NOT_VERIFIED';",
"export type ValidationStatus = 'PASS' | 'WARNING' | 'INCOMPLETE' | 'FAIL' | 'NOT_EVALUATED' | 'NOT_VERIFIED' | 'BLOCKED';");

content = content.replace("if (statuses.includes('NOT_VERIFIED')) return 'NOT_VERIFIED';",
"if (statuses.includes('BLOCKED')) return 'BLOCKED';\n    if (statuses.includes('NOT_VERIFIED')) return 'NOT_VERIFIED';");

fs.writeFileSync(file, content);
