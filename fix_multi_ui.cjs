const fs = require('fs');
let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// Replace the Vpz input with Vpz and Vpz-min
const target = `{systemType === 'multi' && (
                <div className="lg:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase text-amber-400">Primary Supply Airflow Vpz ({flowUnit})</label>
                  <input 
                    type="number" min="0"
                    value={zr.input.primaryAirflow}
                    onChange={(e) => updateZone(zr.input.id, 'primaryAirflow', Number(e.target.value))}
                    className="w-full bg-amber-950/20 text-white rounded-lg px-4 py-2 text-sm border border-amber-900/50 focus:border-amber-500"
                  />
                </div>
              )}`;

const replacement = `{systemType === 'multi' && (
                <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-amber-400 mb-1.5 uppercase">Design Vpz ({flowUnit})</label>
                    <input 
                      type="number" min="0"
                      value={zr.input.primaryAirflow}
                      onChange={(e) => updateZone(zr.input.id, 'primaryAirflow', Number(e.target.value))}
                      className="w-full bg-amber-950/20 text-white rounded-lg px-3 py-2 text-sm border border-amber-900/50 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-amber-500 mb-1.5 uppercase">Min Vpz-min</label>
                    <input 
                      type="number" min="0" placeholder="= Vpz"
                      value={zr.input.vpzMin}
                      onChange={(e) => updateZone(zr.input.id, 'vpzMin', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-amber-950/10 text-white rounded-lg px-3 py-2 text-sm border border-amber-900/30 focus:border-amber-500"
                    />
                  </div>
                </div>
              )}`;

if (file.includes('Primary Supply Airflow Vpz')) {
  file = file.replace(target, replacement);
  fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
  console.log("Fixed UI inputs");
} else {
  console.log("Could not find target block");
}
