import fs from 'fs';
const file = 'src/lib/VentilationEngine.ts';
let content = fs.readFileSync(file, 'utf8');

// The first attempt to add import failed because the replace regex might not have matched.
if (!content.includes('import { AuditStatus }')) {
  // Let's just prepend it.
  content = "import { AuditStatus } from '../calculations/ventilation/Ashrae621ZoneService';\n" + content;
}

content = content.replace(/status: AuditStatus.PASS,/g, "status: 'PASS',");
content = content.replace(/status: toxicLimitExceeded \? 'FAIL' : 'PASS'/g, "status: toxicLimitExceeded ? AuditStatus.FAIL : AuditStatus.PASS");

fs.writeFileSync(file, content);
