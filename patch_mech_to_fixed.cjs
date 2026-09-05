const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

code = code.replace(
  '{ventilationDetails.systemResult.zd.toFixed(3)}',
  '{ventilationDetails.systemResult.zdMax?.toFixed(3) || "0.000"}'
);
code = code.replace(
  '{ventilationDetails.systemResult.ev.toFixed(3)}',
  '{ventilationDetails.systemResult.ev?.toFixed(3) || "0.000"}'
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
