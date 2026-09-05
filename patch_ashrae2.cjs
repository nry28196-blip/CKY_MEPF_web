const fs = require('fs');
const file = 'src/components/Ashrae621VentilationCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(
  /systemResult\.zdMax\.toFixed/g,
  '(systemResult.zdMax || 0).toFixed'
);

code = code.replace(
  /systemResult\.ev\.toFixed/g,
  '(systemResult.ev || 0).toFixed'
);

code = code.replace(
  /systemResult\.xs\.toFixed/g,
  '(systemResult.xs || 0).toFixed'
);

fs.writeFileSync(file, code);
