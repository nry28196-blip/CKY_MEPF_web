const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const target = `                 <div key={z.zoneId} className={\`px-3 py-1.5 rounded border text-xs font-mono \${z.isCritical ? 'bg-amber-950/30 border-amber-500/50 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}\`}>
                   Z{i+1}: {z.zpz.toFixed(3)} {z.isCritical && '(Critical)'}
                 </div>`;

const replacement = `                 <div key={z.zoneId} className={\`px-3 py-1.5 rounded border text-xs font-mono flex flex-col \${z.isCritical ? 'bg-amber-950/30 border-amber-500/50 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}\`}>
                   <span>Z{i+1}: Zpz={z.zpz === Infinity ? '∞' : z.zpz.toFixed(3)} {z.isCritical && ' (Critical)'}</span>
                   <span className="text-[9px] opacity-70">Vpz-min={Math.round(z.vpzMin)} | Voz={z.voz.toFixed(1)}</span>
                 </div>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Updated UI render");
