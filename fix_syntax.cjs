const fs = require('fs');
let code = fs.readFileSync('src/calculations/services/ValidationService.ts', 'utf8');

code = code.replace(/\\`sys_err_\\\$\\{rule\.id\\}\\`/, "`sys_err_${rule.id}`");
code = code.replace(/\\`Rule \\\$\\{rule\.id\\} failed to execute\\.\\`/, "`Rule ${rule.id} failed to execute.`");

fs.writeFileSync('src/calculations/services/ValidationService.ts', code);
console.log("Fixed syntax");
