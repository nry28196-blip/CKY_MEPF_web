const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(
  "ASHRAE 62.1-{edition}",
  "ASHRAE 62.1-{edition}{edition === '2025' ? ' (incl. published addenda/errata)' : ''}"
);
code = code.replace(
  "codeReference={`ASHRAE 62.1-${edition}`}",
  "codeReference={`ASHRAE 62.1-${edition}${edition === '2025' ? ' (incl. addenda)' : ''}`}"
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
