import fs from 'fs';
const file = 'src/lib/VentilationEngine.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('AuditStatus')) {
  content = content.replace(/import \{ StandardDataProvider \} from '\.\.\/calculations\/ventilation\/StandardDataProvider';/, "import { StandardDataProvider } from '../calculations/ventilation/StandardDataProvider';\nimport { AuditStatus } from '../calculations/ventilation/Ashrae621ZoneService';");
}

content = content.replace(/status: 'VERIFIED'/g, "status: AuditStatus.DERIVED");
content = content.replace(/status: 'DERIVED'/g, "status: AuditStatus.DERIVED"); // just to be safe
content = content.replace(/status: 'ESTIMATED'/g, "status: AuditStatus.ESTIMATED"); // just to be safe
content = content.replace(/status: 'PASS'/g, "status: AuditStatus.PASS"); // wait, maybe they use string literal 'PASS'. No wait, I should just fix VERIFIED -> DERIVED and check what else is used in auditTrail.push.

fs.writeFileSync(file, content);
