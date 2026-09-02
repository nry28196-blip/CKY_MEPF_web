const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

code = code.replace(/\(state\) => !\(state\.systemType === 'multi'/g, "(s) => !(s.systemType === 'multi'");
code = code.replace(/message: \(state\) => /g, "message: (s) => ");
code = code.replace(/s\.sumPz/g, "s.sumPz");
code = code.replace(/s\.sumVpzMin/g, "s.sumVpzMin");

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
console.log("Fixed state variable shadowing");
