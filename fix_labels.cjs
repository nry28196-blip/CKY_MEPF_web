const fs = require('fs');

let file = fs.readFileSync('src/components/SystemPerformanceCalc.tsx', 'utf8');

file = file.replace(
  /<p className="text-\[10px\] text-slate-500 font-bold uppercase mb-1">Total Static Pressure<\/p>/g,
  '<p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Static Pressure (SP)</p>'
);

file = file.replace(
  /<p className="text-\[10px\] text-amber-500 font-bold uppercase mb-1">Shaft Power<\/p>/g,
  '<p className="text-[10px] text-amber-500 font-bold uppercase mb-1">Fan Power ({isMetric ? "kW" : "BHP"})</p>'
);

fs.writeFileSync('src/components/SystemPerformanceCalc.tsx', file);
