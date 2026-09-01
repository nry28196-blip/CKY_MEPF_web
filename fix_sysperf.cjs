const fs = require('fs');

let file = fs.readFileSync('src/components/SystemPerformanceCalc.tsx', 'utf8');

file = file.replace(
  /<div>\s*<label className="block text-\[10px\] font-bold text-slate-400 mb-1\.5 uppercase">Elevation[^<]+<\/label>\s*<input type="number" value=\{altitude\}[^>]+>\s*<\/div>/g,
  ''
);

file = file.replace(
  /<div>\s*<label className="block text-\[10px\] font-bold text-slate-400 mb-1\.5 uppercase">Temperature[^<]+<\/label>\s*<input type="number" value=\{airTemp\}[^>]+>\s*<\/div>/g,
  ''
);

fs.writeFileSync('src/components/SystemPerformanceCalc.tsx', file);
