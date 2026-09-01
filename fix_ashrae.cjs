const fs = require('fs');

let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

file = file.replace(
  /<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">/g,
  '<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">'
);

file = file.replace(
  /          <\/div>\n        <\/div>\n          <div>\n            <label className="block text-\[10px\] font-bold text-slate-400 mb-1\.5 uppercase">System Type<\/label>/,
  `          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">System Type</label>`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
