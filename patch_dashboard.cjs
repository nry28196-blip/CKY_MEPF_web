const fs = require('fs');
let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

const oldDashboard = `<div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t('coolingLoadResult')}</p>
                    <p className="text-3xl font-black text-white mt-1 font-mono">
                      {results.tons > 0 ? results.tons.toFixed(2) : '0.00'}{' '}
                      <span className="text-xs font-normal text-slate-400">TR</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t('btuHr')}</p>
                    <p className="text-3xl font-black text-white mt-1 font-mono">
                      {results.btu > 0 ? Math.round(results.btu).toLocaleString() : '0'}{' '}
                      <span className="text-xs font-normal text-slate-400">BTU/h</span>
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t('totalPower')} ({t('watts')})</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1 font-mono">
                      {results.watts > 0 ? Math.round(results.watts).toLocaleString() : '0'}{' '}
                      <span className="text-xs font-normal text-slate-500">W th</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Est. Electrical Input</p>
                    <p className="text-xl font-bold text-sky-400 mt-1 font-mono">
                      {results.watts > 0 ? Math.round(results.watts / 3.5).toLocaleString() : '0'}{' '}
                      <span className="text-xs font-normal text-slate-500">W (COP 3.5)</span>
                    </p>
                  </div>
                </div>`;

const newDashboard = `
                <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Calculated Load</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{Math.round(results.calculatedTotal || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">W</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Sensible Load</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{Math.round(results.totalSensible || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">W</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Latent Load</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{Math.round(results.totalLatent || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">W</span></p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Final Design Load</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1 font-mono">{Math.round(results.watts || 0).toLocaleString()} <span className="text-xs font-normal text-emerald-500/50">W (+{safetyFactor}%)</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t('btuHr')}</p>
                    <p className="text-xl font-bold text-white mt-1 font-mono">{Math.round(results.btu || 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">BTU/h</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Cooling Capacity</p>
                    <p className="text-2xl font-black text-white mt-1 font-mono">{(results.tons || 0).toFixed(2)} <span className="text-xs font-normal text-slate-400">TR</span></p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Rec. AC Capacity</p>
                    <p className="text-xl font-bold text-sky-400 mt-1 font-mono">{Math.ceil((results.tons || 0) * 2) / 2} <span className="text-xs font-normal text-sky-500/50">TR</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Req. Outdoor Air</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{ventilationLps} <span className="text-xs font-normal text-slate-500">L/s</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Est. Electrical Input</p>
                    <p className="text-xl font-bold text-amber-400 mt-1 font-mono">{Math.round((results.watts || 0) / 3.5).toLocaleString()} <span className="text-xs font-normal text-amber-500/50">W (COP 3.5)</span></p>
                  </div>
                </div>
`;

content = content.replace(oldDashboard, newDashboard);
fs.writeFileSync('src/components/MechanicalCalc.tsx', content);
