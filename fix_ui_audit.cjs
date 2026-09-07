const fs = require('fs');

let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

content = content.replace(
  /allAuditTrails\.push\(\.\.\.sr\.zone\.auditTrail, \.\.\.sr\.density\.auditTrail\);/g,
  "allAuditTrails.push(...sr.zone.auditTrail, ...sr.density.auditTrail, ...(sr.auditTrail || []));"
);

content = content.replace(
  /allAuditTrails\.push\(\.\.\.mr\.density\.auditTrail\);/g,
  "allAuditTrails.push(...mr.density.auditTrail, ...(mr.auditTrail || []));"
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
