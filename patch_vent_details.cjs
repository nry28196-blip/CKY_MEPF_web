const fs = require('fs');
const file = 'src/components/MechanicalCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(
  /ventilationDetails\.systemResult\.zdMax\?\.toFixed/g,
  '(ventilationDetails.systemResult.zdMax !== undefined && ventilationDetails.systemResult.zdMax !== null ? ventilationDetails.systemResult.zdMax : 0).toFixed'
);
code = code.replace(
  /ventilationDetails\.systemResult\.ev\?\.toFixed/g,
  '(ventilationDetails.systemResult.ev !== undefined && ventilationDetails.systemResult.ev !== null ? ventilationDetails.systemResult.ev : 0).toFixed'
);
code = code.replace(
  /Math\.round\(ventilationDetails\.systemResult\.vou\)/g,
  'Math.round(ventilationDetails.systemResult.vou || 0)'
);
code = code.replace(
  /Math\.round\(ventilationDetails\.systemResult\.vot\)/g,
  'Math.round(ventilationDetails.systemResult.vot || 0)'
);

fs.writeFileSync(file, code);
