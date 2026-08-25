const fs = require('fs');

const file = 'src/components/TrendVisualizer.tsx';
let code = fs.readFileSync(file, 'utf8');

const tooltipDef = `
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (type === 'plumbing_fixtures') {
        const isCurrentPoint = currentXValue === label;
        return (
          <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-xl shadow-2xl min-w-[220px]">
            <p className="text-white font-bold mb-2 pb-2 border-b border-slate-800 text-sm">
              <span className="text-slate-400 font-medium">Load:</span> {label} WSFU / LU
            </p>
            {payload.map((entry: any, index: number) => {
              const gpm = (entry.value / 0.06309).toFixed(1);
              return (
                <div key={index} className="flex justify-between items-center gap-6 text-xs my-1.5">
                  <span style={{ color: entry.color }} className="font-semibold">{entry.name}</span>
                  <div className="text-right flex flex-col">
                    <span className="text-white font-mono font-bold">{entry.value} L/s</span>
                    <span className="text-slate-400 font-mono text-[10px]">({gpm} GPM)</span>
                  </div>
                </div>
              );
            })}
            {isCurrentPoint && (
              <div className="mt-3 pt-2 border-t border-slate-800/80 bg-slate-900/50 -mx-1 -mb-1 p-2 rounded-lg">
                 <p className="text-[11px] text-cyan-400 font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5"/> Interpolated Calc Point
                 </p>
                 <p className="text-[10px] text-slate-400 leading-tight">
                   This exact WSFU load is interpolated linearly between adjacent standard points on the Hunter's curve.
                 </p>
              </div>
            )}
          </div>
        );
      }
      return (
        <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-xl">
          <p className="text-white font-bold mb-2 pb-2 border-b border-slate-800 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center gap-4 text-xs my-1">
              <span style={{ color: entry.color }} className="font-semibold">{entry.name}:</span>
              <span className="text-white font-mono">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (`;

code = code.replace(/  return \(\n    <div className="bg-slate-900\/45/, tooltipDef + '\n    <div className="bg-slate-900/45');

const tooltipRegex = /<Tooltip \n                  contentStyle=\{\{\n                    backgroundColor: tooltipBg,\n                    borderColor: tooltipBorder,\n                    borderRadius: '12px',\n                    color: tooltipText,\n                  \}\}\n                \/>/g;

code = code.replace(tooltipRegex, '<Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2 }} />');

fs.writeFileSync(file, code);
console.log("Patched tooltips");
