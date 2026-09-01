const fs = require('fs');

let file = fs.readFileSync('src/components/SystemPerformanceCalc.tsx', 'utf8');

file = file.replace(
  /            <div>\n              <label className="block text-\[10px\] font-bold text-slate-400 mb-1\.5 uppercase">Elevation[^<]+<\/label>\n              <input type="number" value=\{altitude\}[^>]+>\n            <\/div>\n/g,
  ''
);

file = file.replace(
  /            <div>\n              <label className="block text-\[10px\] font-bold text-slate-400 mb-1\.5 uppercase">Temperature[^<]+<\/label>\n              <input type="number" value=\{airTemp\}[^>]+>\n            <\/div>\n/g,
  ''
);

fs.writeFileSync('src/components/SystemPerformanceCalc.tsx', file);
