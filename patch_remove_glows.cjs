const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

code = code.replace(/<div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500\/5 rounded-full blur-2xl pointer-events-none" \/>\n?/g, '');

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Patched glows");
