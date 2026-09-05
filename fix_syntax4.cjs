const fs = require('fs');
const file = 'src/lib/exportCsv.ts';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/params\.\(current \|\| 0\)\.toFixed/g, '(params.current || 0).toFixed');

fs.writeFileSync(file, code);
