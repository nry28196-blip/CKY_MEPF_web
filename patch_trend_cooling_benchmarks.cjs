const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const targetStr = `{viewType === 'trend' && type === 'ductSizing' && (`;

const replacementStr = `{viewType === 'trend' && type === 'cooling' && (
            <div className="flex bg-slate-950 border border-slate-850 p-0.5 rounded-lg text-[9px] font-bold uppercase gap-1 overflow-x-auto max-w-full items-center">
              <div className="px-2 py-1 text-slate-500">Benchmarks:</div>
              {coolingBenchmarks.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    const newB = [...coolingBenchmarks];
                    const idx = newB.findIndex(x => x.id === b.id);
                    newB[idx].enabled = !newB[idx].enabled;
                    setCoolingBenchmarks(newB);
                  }}
                  className={\`px-2 py-1 rounded-md transition-all cursor-pointer \${b.enabled ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}\`}
                >
                  {b.value} W/m²
                </button>
              ))}
            </div>
          )}
          
          {viewType === 'trend' && type === 'ductSizing' && (`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
