const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

code = code.replace(
  "import EngineeringAuditTrail from './common/EngineeringAuditTrail';",
  "import EngineeringAuditTrail from './common/EngineeringAuditTrail';\nimport EngineeringStatusHeader from './common/EngineeringStatusHeader';"
);

const insertTarget = `<div className="space-y-6 animate-fade-in">`;
const headerInject = `<div className="space-y-6 animate-fade-in">
      <EngineeringStatusHeader 
        status={validations.length > 0 ? (validations.some(i => i.severity === 'error') ? 'FAIL' : 'WARNING') : 'PASS'} 
        message={validations.length > 0 ? "Calculation contains issues. Please review warnings." : "Required zone and system outdoor airflow requirements satisfied."}
      />`;

code = code.replace(insertTarget, headerInject);

// Remove text-[9px] and text-[10px]
code = code.replace(/text-\[9px\]/g, "text-xs");
code = code.replace(/text-\[10px\]/g, "text-xs");

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
console.log("Patched Ashrae621VentilationCalc header");
