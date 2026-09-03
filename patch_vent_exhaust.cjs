const fs = require('fs');
let code = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

code = code.replace(
  /import CommercialLocalExhaustCalc from '\.\/CommercialLocalExhaustCalc';/,
  "import Ashrae621ExhaustCalc from './Ashrae621ExhaustCalc';"
);
code = code.replace(
  /\{ventMode === 'exhaust' && <CommercialLocalExhaustCalc \/>\}/,
  "{ventMode === 'exhaust' && <Ashrae621ExhaustCalc />}"
);

fs.writeFileSync('src/components/VentilationCalc.tsx', code);
console.log("Patched Vent exhaust");
