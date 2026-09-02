const fs = require('fs');
let file = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

if (!file.includes('import Ashrae621ExhaustCalc')) {
  file = file.replace(
    /import DuctSizingCalc from '.\/DuctSizingCalc';/,
    `$&
import Ashrae621ExhaustCalc from './Ashrae621ExhaustCalc';`
  );
}

fs.writeFileSync('src/components/MechanicalCalc.tsx', file);
