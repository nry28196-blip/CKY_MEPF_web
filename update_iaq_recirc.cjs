const fs = require('fs');
let content = fs.readFileSync('src/components/IAQCalc.tsx', 'utf8');

const target = `            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Exhaust / Source Type</label>
              <select 
                value={exhaustSource} onChange={(e) => setExhaustSource(e.target.value)}
                className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-amber-500"
              >
                {exhaustClasses.map((ec: any) => (
                  <option key={\`class\${ec.class}\`} value={\`class\${ec.class}\`}>Class {ec.class} Exhaust ({ec.description})</option>
                ))}
                <option value="plumbing">Plumbing Vents</option>
                <option value="garage">Parking Garage Exhaust</option>
                <option value="cooling_tower">Cooling Tower Exhaust</option>
              </select>
            </div>`;

const replacement = target + `
            {exhaustSource.startsWith('class') && (() => {
              const classNum = parseInt(exhaustSource.replace('class', ''));
              const ec = exhaustClasses.find((c: any) => c.class === classNum);
              if (!ec) return null;
              return (
                <div className="mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800/50">
                   <h5 className="text-[9px] font-bold text-amber-500/70 uppercase tracking-widest mb-1">Recirculation Rule (2025 Std)</h5>
                   <p className="text-xs text-slate-300">
                     {ec.recirculationAllowed === true && "Full recirculation allowed to any space."}
                     {ec.recirculationAllowed === 'limited' && "Limited recirculation allowed (only to Class 2/3/4 spaces, never to Class 1)."}
                     {ec.recirculationAllowed === false && "Strictly no recirculation. Must be exhausted directly outdoors."}
                   </p>
                </div>
              )
            })()}`;

if (!content.includes('Recirculation Rule (2025 Std)')) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/IAQCalc.tsx', content);
  console.log("Recirculation UI added");
}
