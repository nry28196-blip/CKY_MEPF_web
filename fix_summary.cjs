const fs = require('fs');

let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const summaryCard = `
      {/* Context Summary Card */}
      <div className="bg-sky-950/30 border border-sky-900/50 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <div className="bg-sky-500/20 p-2 rounded-lg border border-sky-500/30">
            <Info className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h4 className="text-white text-sm font-bold">Calculation Context</h4>
            <p className="text-xs text-slate-400">Active Parameters</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 md:gap-8">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">ASHRAE Edition</p>
            <p className="text-sm font-mono text-sky-300 font-bold">{edition}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Air Distribution (Ez)</p>
            <p className="text-sm font-mono text-sky-300 font-bold">
              {zones.length === 1 
                ? zoneResults[0].result.ez.toFixed(2) 
                : 'Zone Specific'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Density Factor (Eρ)</p>
            <p className="text-sm font-mono text-sky-300 font-bold">{densityRatio.toFixed(3)}</p>
          </div>
        </div>
      </div>
`;

// Insert after <div className="space-y-6 animate-fade-in">
file = file.replace(
  /<div className="space-y-6 animate-fade-in">/,
  `<div className="space-y-6 animate-fade-in">${summaryCard}`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
