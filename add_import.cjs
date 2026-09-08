const fs = require('fs');
let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');
if (!content.includes('import EngineeringAuditTrail')) {
  content = content.replace(
    /import TooltipLabel from '\.\/TooltipLabel';/,
    "import TooltipLabel from './TooltipLabel';\nimport EngineeringAuditTrail from './common/EngineeringAuditTrail';"
  );
  fs.writeFileSync('src/components/MechanicalCalc.tsx', content);
}
