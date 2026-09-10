import fs from 'fs';
const file = 'src/calculations/ventilation/Ashrae621ZoneService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/status: 'DERIVED'/g, "status: AuditStatus.DERIVED");
content = content.replace(/status: 'VERIFIED'/g, "status: AuditStatus.DERIVED"); // just in case

fs.writeFileSync(file, content);
