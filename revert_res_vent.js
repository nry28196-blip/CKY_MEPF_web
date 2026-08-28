import fs from 'fs';
let code = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf8');

// State
if (!code.includes('kitchenVolume')) {
    code = code.replace(
      'const [bedrooms, setBedrooms] = useState<number>(3);',
      'const [bedrooms, setBedrooms] = useState<number>(3);\n  const [kitchenVolume, setKitchenVolume] = useState<number>(isMetric ? 30 : 1000);'
    );
}

// Imports
if (!code.includes('Droplets')) {
    code = code.replace(
      'Home, Wind, CheckCircle2, AlertTriangle }',
      'Home, Wind, CheckCircle2, AlertTriangle, Droplets, ChefHat }'
    );
}

const exhaustBlock = `
          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <div className="flex items-center space-x-2">
                <Wind className="h-5 w-5 text-sky-400" />
                <h3 className="text-sm font-bold text-slate-200 tracking-wide">Local Source Exhaust (ASHRAE 62.2)</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kitchen Exhaust Calculator */}
              <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
                    <ChefHat className="w-4 h-4 mr-1.5 text-amber-500" /> Kitchens
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Intermittent (Vented Hood)</span>
                      <p className="text-lg font-bold text-white font-mono">
                        {isMetric ? '50' : '100'} <span className="text-[10px] font-normal text-slate-400 normal-case">{flowUnit}</span>
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-800/50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-slate-500 uppercase">Continuous (5 ACH)</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex-1">
                          <label className="text-[9px] text-slate-400 uppercase">Volume ({isMetric ? 'm³' : 'ft³'})</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Volume"
                            value={kitchenVolume || ''}
                            onChange={(e) => setKitchenVolume(Number(e.target.value) || 0)}
                            className="w-full bg-slate-950 text-white rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/50 border border-slate-800"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[9px] text-slate-400 uppercase">Req. ({flowUnit})</label>
                          <div className="w-full bg-slate-900 text-amber-400 rounded-lg px-2 py-1.5 text-xs font-mono border border-slate-800 flex items-center">
                            {kitchenVolume ? (isMetric ? (kitchenVolume * 5 / 3.6).toFixed(1) : (kitchenVolume * 5 / 60).toFixed(1)) : '0.0'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bathroom Exhaust */}
              <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
                    <Droplets className="w-4 h-4 mr-1.5 text-cyan-500" /> Bathrooms
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Intermittent Exhaust</span>
                      <p className="text-lg font-bold text-white font-mono">
                        {isMetric ? '25' : '50'} <span className="text-[10px] font-normal text-slate-400 normal-case">{flowUnit}</span>
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-800/50">
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Continuous Exhaust</span>
                      <p className="text-lg font-bold text-white font-mono">
                        {isMetric ? '10' : '20'} <span className="text-[10px] font-normal text-slate-400 normal-case">{flowUnit}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/50">
                  <p className="text-[9px] text-slate-500 leading-tight">
                    * Rates apply per bathroom. Local exhaust removes air directly from pollutant/moisture sources, separate from whole-dwelling ventilation.
                  </p>
                </div>
              </div>
            </div>
          </div>`;

const targetInsert = `</div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Number of Bedrooms</label>
                <input
                  type="number"
                  min="1"
                  value={bedrooms || ''}
                  onChange={(e) => setBedrooms(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 text-white rounded-lg px-3.5 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 border border-slate-800 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>`;

code = code.replace(targetInsert, targetInsert + '\n' + exhaustBlock);
fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', code);
