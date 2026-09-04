const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', 'utf-8');

const target = `if (input.systemPopulation === null || input.systemPopulation === undefined || isNaN(input.systemPopulation)) {
      status = 'INCOMPLETE';
      warning = 'System population (Ps) not provided. Calculation requires explicit Ps.';
    }`;

const replacement = `if (input.systemPopulation === null || input.systemPopulation === undefined || isNaN(input.systemPopulation)) {
      if (status !== 'FAIL') {
        status = 'INCOMPLETE';
      }
      warning = 'System population (Ps) not provided. Calculation requires explicit Ps.';
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', code);
