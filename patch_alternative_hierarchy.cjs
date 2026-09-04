const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', 'utf-8');

code = code.replace(
  /if \(input\.systemPopulation === null \|\| input\.systemPopulation === undefined \|\| isNaN\(input\.systemPopulation\)\) \{\n\s*status = 'INCOMPLETE';/g,
  `if (input.systemPopulation === null || input.systemPopulation === undefined || isNaN(input.systemPopulation)) {
      if (status !== 'FAIL') {
        status = 'INCOMPLETE';
      }`
);

code = code.replace(
  /if \(input\.vps === null \|\| input\.vps === undefined \|\| isNaN\(input\.vps\)\) \{\n\s*status = 'INCOMPLETE';/g,
  `if (input.vps === null || input.vps === undefined || isNaN(input.vps)) {
      if (status !== 'FAIL') {
        status = 'INCOMPLETE';
      }`
);

fs.writeFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', code);
