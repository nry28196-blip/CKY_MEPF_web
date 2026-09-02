const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

code = code.replace(
  "import EngineeringAuditTrail from './EngineeringAuditTrail';",
  "import EngineeringAuditTrail from './common/EngineeringAuditTrail';"
);

code = code.replace(
  /variables=\{\[/,
  'trail={['
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
console.log("Patched import and prop name");
