const fs = require('fs');
const file = 'src/components/Ashrae621VentilationCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/systemResult\.vot === null/g, 'systemResult.vot == null');

fs.writeFileSync(file, code);
