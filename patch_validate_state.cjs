const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(
  /const state = \{\n\s*systemType,\n\s*systemPopulation,/,
  `const state = {
      systemType,
      isVAV,
      systemPopulation,`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
