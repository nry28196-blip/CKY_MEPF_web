const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

code = code.replace(
  /\) : subTab === 'airBalance' \? \(\n\s*<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">\n\s*<AirBalanceCalc \/>\n\s*<\/div>\n\s*\) : subTab === 'exhaust' \? \(\n\s*<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">\n\s*<Ashrae621ExhaustCalc \/>\n\s*<\/div>\n\s*/,
  ""
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Patched Mech render");
