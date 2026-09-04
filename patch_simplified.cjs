const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', 'utf-8');

code = code.replace(
  /if \(input\.systemPopulation === null \|\| input\.systemPopulation === undefined\) \{\n\s*if \(status as string !== 'FAIL'\) status = 'WARNING';\n\s*warning = 'Ps not provided — calculation assumes D = 1\.00\.';\n\s*\}/,
  `if (input.systemPopulation === null || input.systemPopulation === undefined || isNaN(input.systemPopulation)) {
      status = 'INCOMPLETE';
      warning = 'System population (Ps) not provided. Calculation requires explicit Ps.';
    }`
);

fs.writeFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', code);
