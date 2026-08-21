const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const targetStr = `{coolingBenchmarks.map(b => (
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
              ))}`;

const replacementStr = `{coolingBenchmarks.map(b => (
                <div key={b.id} className={\`flex items-center rounded-md border \${b.enabled ? 'bg-slate-800 border-slate-700' : 'opacity-60 border-transparent'} overflow-hidden\`}>
                  <button
                    onClick={() => {
                      const newB = [...coolingBenchmarks];
                      const idx = newB.findIndex(x => x.id === b.id);
                      newB[idx].enabled = !newB[idx].enabled;
                      setCoolingBenchmarks(newB);
                    }}
                    className={\`px-2 py-1 transition-all cursor-pointer \${b.enabled ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-500'}\`}
                  >
                    {b.enabled ? '✓' : '✗'}
                  </button>
                  <input
                    type="number"
                    value={b.value}
                    onChange={(e) => {
                      const newB = [...coolingBenchmarks];
                      const idx = newB.findIndex(x => x.id === b.id);
                      newB[idx].value = Number(e.target.value);
                      setCoolingBenchmarks(newB);
                    }}
                    className="w-12 bg-transparent text-white focus:outline-none text-center py-1"
                    disabled={!b.enabled}
                  />
                  <span className="pr-2 text-[8px] text-slate-400 normal-case">W/m²</span>
                </div>
              ))}`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
