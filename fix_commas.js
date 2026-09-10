import fs from 'fs';

const files = [
  'src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts',
  'src/calculations/ventilation/Ashrae621AlternativeSystemService.ts',
  'src/calculations/ventilation/Ashrae621DensityService.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/'\n      status: AuditStatus.DERIVED/g, "',\n      status: AuditStatus.DERIVED");
  content = content.replace(/}\n      status: AuditStatus.DERIVED/g, "},\n      status: AuditStatus.DERIVED");
  content = content.replace(/null\n      status: AuditStatus.DERIVED/g, "null,\n      status: AuditStatus.DERIVED");
  content = content.replace(/vps\n      status: AuditStatus.DERIVED/g, "vps,\n      status: AuditStatus.DERIVED");
  content = content.replace(/eRho\n      status: AuditStatus.DERIVED/g, "eRho,\n      status: AuditStatus.DERIVED");
  fs.writeFileSync(file, content);
}
