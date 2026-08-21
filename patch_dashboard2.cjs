const fs = require('fs');
let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

const target = `<div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Req. Outdoor Air</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{ventilationLps} <span className="text-xs font-normal text-slate-500">L/s</span></p>
                  </div>`;

const replacement = `<div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Req. Outdoor Air</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{ventilationLps} <span className="text-xs font-normal text-slate-500">L/s</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Req. Supply Air</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{Math.round((results.totalSensible || 0) / 13.31 * 2.11888).toLocaleString()} <span className="text-xs font-normal text-slate-500">CFM</span></p>
                  </div>`;

content = content.replace(target, replacement);

const gridTarget = `<div className="grid grid-cols-3 gap-y-6 gap-x-4">`;
const gridReplace = `<div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">`;
content = content.replace(gridTarget, gridReplace);

fs.writeFileSync('src/components/MechanicalCalc.tsx', content);
