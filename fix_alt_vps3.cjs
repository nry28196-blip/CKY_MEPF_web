const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', 'utf-8');

const target = `if (input.vps === null || input.vps === undefined || isNaN(input.vps)) {
      if (status as string !== "FAIL" && status as string !== "INCOMPLETE") status = 'WARNING';
      warning = (warning ? warning + ' ' : '') + \`Assumed Vps = \${sumVpz} (Sum of Vpz).\`;
      vps = sumVpz;
    }`;

const replacement = `if (input.vps === null || input.vps === undefined || isNaN(input.vps)) {
      if (status !== 'FAIL') {
        status = 'INCOMPLETE';
      }
      warning = (warning ? warning + ' ' : '') + 'System primary airflow (Vps) is required for alternative procedure.';
      vps = sumVpz;
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', code);
