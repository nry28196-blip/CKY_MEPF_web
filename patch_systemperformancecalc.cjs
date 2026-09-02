const fs = require('fs');
let content = fs.readFileSync('src/components/SystemPerformanceCalc.tsx', 'utf8');

const targetUI = `            <div>
              <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Motor Electrical Duty</p>
              <p className="text-3xl font-black font-mono tracking-tight text-white">{result.motorElectricalPower.toFixed(2)} <span className="text-lg font-sans font-bold text-emerald-400/80">kW</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>`;

const replaceUI = `            <div>
              <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Motor Electrical Duty</p>
              <p className="text-3xl font-black font-mono tracking-tight text-white">{result.motorElectricalPower.toFixed(2)} <span className="text-lg font-sans font-bold text-emerald-400/80">kW</span></p>
            </div>
          </div>
        </div>

        {/* Fan Affinity Laws */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-sky-400" />
            VAV Turndown / Fan Affinity Laws (50% Flow)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Q2 (Flow)</span>
              <p className="text-lg font-mono text-white mt-1">{result.turndownAirflow?.toFixed(0)} <span className="text-xs text-slate-500">{flowUnit}</span></p>
              <p className="text-[9px] text-slate-500 mt-1">Linear (RPM)</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase">P2 (Static)</span>
              <p className="text-lg font-mono text-white mt-1">{result.turndownStaticPressure?.toFixed(2)} <span className="text-xs text-slate-500">{pressureUnit}</span></p>
              <p className="text-[9px] text-slate-500 mt-1">Square Law (RPM²)</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-lg border border-sky-900/30">
              <span className="text-[10px] font-bold text-sky-400 uppercase">W2 (Electrical Power)</span>
              <p className="text-xl font-mono text-white mt-1 font-bold">{result.turndownMotorElectricalPower?.toFixed(2)} <span className="text-xs text-sky-400">kW</span></p>
              <p className="text-[9px] text-slate-500 mt-1">Empirical VAV (RPM^2.5)</p>
            </div>
          </div>
        </div>

      </div>
    </div>`;

content = content.replace(targetUI, replaceUI);
fs.writeFileSync('src/components/SystemPerformanceCalc.tsx', content);
console.log("Patched SystemPerformanceCalc");
