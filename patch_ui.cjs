const fs = require('fs');
let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// The block starts with `<div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4 google-pro-border-emerald">`
// and ends right before `<motion.div` where `key={`${results.tons.toFixed(4)}-${results.btu}`}` is.

const newUI = `
            {/* INDIVIDUAL SPACE MODE */}
            <div className="flex flex-col gap-6">
              <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4 google-pro-border-emerald">
                <div className="flex items-center space-x-2 mb-2 border-b border-slate-800 pb-3">
                  <Thermometer className="h-4.5 w-4.5 text-emerald-400" />
                  <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">ASHRAE Component Inputs</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Area (m²)</label>
                    <input type="number" value={area} onChange={e => setArea(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Height (m)</label>
                    <input type="number" value={height} onChange={e => setHeight(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Indoor Temp (°C)</label>
                    <input type="number" value={indoorTemp} onChange={e => setIndoorTemp(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Outdoor Temp (°C)</label>
                    <input type="number" value={outdoorTemp} onChange={e => setOutdoorTemp(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Occupants</label>
                    <input type="number" value={occupants} onChange={e => setOccupants(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Lighting (W/m²)</label>
                    <input type="number" value={lightingWpm2} onChange={e => setLightingWpm2(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Equipment (W)</label>
                    <input type="number" value={equipmentWatts} onChange={e => setEquipmentWatts(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Ventilation (L/s)</label>
                    <input type="number" value={ventilationLps} onChange={e => setVentilationLps(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Wall Area (m²)</label>
                    <input type="number" value={wallArea} onChange={e => setWallArea(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Wall U-Val</label>
                    <input type="number" value={wallUValue} step="0.1" onChange={e => setWallUValue(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Roof Area (m²)</label>
                    <input type="number" value={roofArea} onChange={e => setRoofArea(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Roof U-Val</label>
                    <input type="number" value={roofUValue} step="0.1" onChange={e => setRoofUValue(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Window (m²)</label>
                    <input type="number" value={windowArea} onChange={e => setWindowArea(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Window U-Val</label>
                    <input type="number" value={windowUValue} step="0.1" onChange={e => setWindowUValue(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Window SHGC</label>
                    <input type="number" value={windowShgc} step="0.1" onChange={e => setWindowShgc(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Safety Factor (%)</label>
                    <input type="number" value={safetyFactor} onChange={e => setSafetyFactor(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:border-emerald-500" />
                  </div>
                </div>
              </div>
`;

// Replace from '/* INDIVIDUAL SPACE MODE */' up to but not including '<motion.div'
const regex = /\{\/\* INDIVIDUAL SPACE MODE \*\/\}([\s\S]*?)<motion\.div/;
content = content.replace(regex, newUI + '\n              <motion.div');

fs.writeFileSync('src/components/MechanicalCalc.tsx', content);
