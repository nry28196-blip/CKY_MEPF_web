const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

code = code.replace(
  /<div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-sky-950\/10">/,
  '<div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">'
);

code = code.replace(
  /<BookOpen className="w-4 h-4 text-sky-400" \/>/,
  '<BookOpen className="w-4 h-4 text-cyan-400" />'
);

code = code.replace(
  /focus:border-sky-500/g,
  'focus:border-cyan-500'
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Patched Engineering Context");
