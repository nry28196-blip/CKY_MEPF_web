const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', 'utf-8');

const targetEp = `const ep = z.ep ?? 1.0;`;
const replacementEp = `if (z.ep === undefined || isNaN(z.ep)) {
        if (status !== 'FAIL') status = 'INCOMPLETE';
        warning = 'Primary air fraction (Ep) is missing for one or more zones.';
      }
      const ep = z.ep !== undefined && !isNaN(z.ep) ? z.ep : 1.0;`;

const targetEr = `const er = z.er ?? 0.0;`;
const replacementEr = `if (z.er === undefined || isNaN(z.er)) {
        if (status !== 'FAIL') status = 'INCOMPLETE';
        warning = 'Secondary recirculation fraction (Er) is missing for one or more zones.';
      }
      const er = z.er !== undefined && !isNaN(z.er) ? z.er : 0.0;`;

code = code.replace(targetEp, replacementEp);
code = code.replace(targetEr, replacementEr);

fs.writeFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', code);
