const fs = require('fs');
const file = 'src/components/Ashrae621VentilationCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/systemResult\.d\.toFixed/g, '(systemResult.d || 0).toFixed');
code = code.replace(/systemResult\.ps\.toFixed/g, '(systemResult.ps || 0).toFixed');
code = code.replace(/systemResult\.sumPz\.toFixed/g, '(systemResult.sumPz || 0).toFixed');

fs.writeFileSync(file, code);
