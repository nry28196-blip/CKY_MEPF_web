const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

code = code.replace(/import Ashrae621ExhaustCalc from '\.\/Ashrae621ExhaustCalc';\n/, '');
code = code.replace(/import AirBalanceCalc from '\.\/AirBalanceCalc';\n/, '');

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Patched Mech imports");
