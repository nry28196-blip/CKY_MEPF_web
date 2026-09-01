const fs = require('fs');
let file = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

file = file.replace(/ \| 'performance'/g, '');

file = file.replace(
  /          <button\n            type="button"\n            onClick=\{\(\) => setVentMode\('performance'\)\}\n            className=\{`px-3 py-1\.5 rounded-lg transition-all cursor-pointer \$\{\n              ventMode === 'performance' \? 'bg-amber-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'\n            \}`\}\n          >\n            System Performance\n          <\/button>\n/g,
  ''
);

file = file.replace(/        \{ventMode === 'performance' && <SystemPerformanceCalc globalAltitude=\{globalAltitude\} globalAirTemp=\{globalAirTemp\} \/>\}\n/g, '');

fs.writeFileSync('src/components/VentilationCalc.tsx', file);
