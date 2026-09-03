const fs = require('fs');
let code = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

code = code.replace(
  /'bg-cyan-950\/30 text-cyan-400 border-b-2 border-cyan-500'/g,
  "'bg-cyan-950/30 text-cyan-400 border border-cyan-500/50 rounded-lg'"
);
code = code.replace(
  /'text-slate-500 hover:text-slate-300 border-b-2 border-transparent'/g,
  "'text-slate-500 hover:text-slate-300 border border-transparent rounded-lg'"
);

fs.writeFileSync('src/components/VentilationCalc.tsx', code);
console.log("Patched Vent tabs borders");
