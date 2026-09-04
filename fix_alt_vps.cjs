const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', 'utf-8');

code = code.replace(
  /if \\(input\.vps === null \|\| input\.vps === undefined \|\| isNaN\\(input\.vps\\)\\) \\{\n\s*if \\(status as string !== "FAIL" && status as string !== "INCOMPLETE"\\) status = 'WARNING';\n\s*warning = \\(warning \? warning \+ ' ' : ''\\) \+ \`Assumed Vps = \\$\\{sumVpz\\} \\(Sum of Vpz\\)\.\`;\n\s*vps = sumVpz;\n\s*\\}/,
  `if (input.vps === null || input.vps === undefined || isNaN(input.vps)) {
      if (status !== 'FAIL') {
        status = 'INCOMPLETE';
      }
      warning = (warning ? warning + ' ' : '') + 'System primary airflow (Vps) is required for alternative procedure.';
      vps = sumVpz;
    }`
);

fs.writeFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', code);
