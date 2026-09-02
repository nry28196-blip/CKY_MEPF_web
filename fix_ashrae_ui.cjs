const fs = require('fs');
let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// Replace the primary airflow div block
file = file.replace(
  /\{systemType === 'multi' && \(\s+<div className="lg:col-span-2">\s+<label className="block text-\[10px\] font-bold text-slate-400 mb-1\.5 uppercase text-amber-400">Primary Supply Airflow Vpz \(\{flowUnit\}\)<\/label>\s+<input[^>]+>\s+<\/div>\s+\)\}/,
  `{systemType === 'multi' && (
                <>
                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase text-amber-400">Design Vpz ({flowUnit})</label>
                    <ValidatedInput 
                      type="number" min={0} errorMsg="Flow >= 0"
                      value={zr.input.primaryAirflow}
                      onChange={(e) => updateZone(zr.input.id, 'primaryAirflow', Number(e.target.value))}
                      className="w-full bg-amber-950/20 text-white rounded-lg px-3 py-2 text-sm border border-amber-900/50 focus:border-amber-500"
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase text-amber-400">Min Vpz-min ({flowUnit})</label>
                    <ValidatedInput 
                      type="number" min={0} errorMsg="Flow >= 0"
                      value={zr.input.vpzMin}
                      onChange={(e) => updateZone(zr.input.id, 'vpzMin', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Auto"
                      className="w-full bg-amber-950/20 text-white rounded-lg px-3 py-2 text-sm border border-amber-900/50 focus:border-amber-500"
                    />
                  </div>
                </>
              )}`
);

// Add the System level inputs below the common settings
// Look for this pattern: <div className="space-y-6"> followed by zones.map
const injectionTarget = `{zones.map((zr, index) => (`;
const systemInputs = `{systemType === 'multi' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 shadow-lg">
            <h3 className="text-sm font-semibold text-white mb-4">System Parameters (VAV/Multi-Zone)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Peak System Population (Ps)</label>
                <ValidatedInput 
                  type="number" min={0} errorMsg="Population >= 0"
                  value={systemPopulation}
                  onChange={(e) => setSystemPopulation(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Auto (Sum of Zones)"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Min System Primary Airflow (Vps) ({flowUnit})</label>
                <ValidatedInput 
                  type="number" min={0} errorMsg="Flow >= 0"
                  value={systemPrimaryAirflow}
                  onChange={(e) => setSystemPrimaryAirflow(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Auto (Sum of Vpz-min)"
                />
              </div>
            </div>
          </div>
        )}
        
        `;

file = file.replace(injectionTarget, systemInputs + injectionTarget);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
