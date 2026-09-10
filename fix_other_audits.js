import fs from 'fs';

const files = [
  'src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts',
  'src/calculations/ventilation/Ashrae621AlternativeSystemService.ts',
  'src/calculations/ventilation/Ashrae621DensityService.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('auditTrail.push') && !content.includes('AuditStatus.DERIVED')) {
    if (!content.includes('AuditStatus')) {
       content = content.replace(/import \{ AuditTrailItem \} from '.\/Ashrae621ZoneService';/, "import { AuditTrailItem, AuditStatus } from './Ashrae621ZoneService';");
    }
    
    // Some have revision too, but let's just append status before closing }
    content = content.replace(/    \}\);/g, "      status: AuditStatus.DERIVED\n    });");
    
    fs.writeFileSync(file, content);
  }
}
