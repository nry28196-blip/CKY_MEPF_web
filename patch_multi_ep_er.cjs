const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf-8');

code = code.replace(
  /ep: z\.input\.ep !== undefined \? Number\(z\.input\.ep\) : 1\.0,\n\s*er: z\.input\.er !== undefined \? Number\(z\.input\.er\) : 0\.0/,
  `ep: z.input.ep !== '' && z.input.ep !== undefined ? Number(z.input.ep) : undefined,
         er: z.input.er !== '' && z.input.er !== undefined ? Number(z.input.er) : undefined`
);

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', code);
