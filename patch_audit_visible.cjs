const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const target1 = `<details className="group">
              <summary className="text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer flex items-center hover:text-slate-300 transition-colors">
                <span className="flex-1">System Engineering Audit Trail</span>
                <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 space-y-3">`;
const replace1 = `<div className="bg-slate-950/50 rounded-lg border border-slate-800/50 overflow-hidden">
              <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800/50 flex items-center">
                <Activity className="w-3.5 h-3.5 text-sky-400 mr-2" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Engineering Audit Trail</span>
              </div>
              <div className="p-4 space-y-3">`;

content = content.replace(target1, replace1);
content = content.replace(`              </div>\n            </details>`, `              </div>\n            </div>`);

const target2 = `<details className="group">
                <summary className="text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer flex items-center hover:text-slate-300 transition-colors">
                  <span className="flex-1">Calculation Audit Trail</span>
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-3 bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 space-y-2.5">`;

const replace2 = `<div className="bg-slate-950/50 rounded-lg border border-slate-800/50 overflow-hidden">
                <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800/50 flex items-center">
                  <Activity className="w-3.5 h-3.5 text-sky-400 mr-2" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Engineering Audit Trail</span>
                </div>
                <div className="p-4 space-y-2.5">`;

content = content.replace(target2, replace2);
content = content.replace(`                </div>\n              </details>`, `                </div>\n              </div>`);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Patched Ashrae621VentilationCalc for visible Engineering Audit Trail panels");
