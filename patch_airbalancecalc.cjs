const fs = require('fs');
let content = fs.readFileSync('src/components/AirBalanceCalc.tsx', 'utf8');

// 1. Add volume state
const stateTarget = `const [sysExhaust, setSysExhaust] = useState<number>(2000);`;
const stateReplacement = `const [sysExhaust, setSysExhaust] = useState<number>(2000);\n  const [sysVolume, setSysVolume] = useState<number>(isMetric ? 1000 : 35000);`;
content = content.replace(stateTarget, stateReplacement);

// 2. Add to systemInput
const inputTarget = `const systemInput: SystemBalanceInput = {
    qSupply: sysSupply, qOutdoorAir: sysOutdoor, qReturn: sysReturn, qExhaust: sysExhaust
  };`;
const inputReplacement = `const systemInput: SystemBalanceInput = {
    qSupply: sysSupply, qOutdoorAir: sysOutdoor, qReturn: sysReturn, qExhaust: sysExhaust,
    buildingVolume: sysVolume, isMetric
  };`;
content = content.replace(inputTarget, inputReplacement);

// 3. Add volume input field in UI
const uiInputTarget = `              <div>
                <label className="block text-[10px] font-bold text-rose-400 mb-1.5 uppercase">Total Exhaust Air ({flowUnit})</label>
                <input 
                  type="number" min="0" step="100"
                  value={sysExhaust}
                  onChange={(e) => setSysExhaust(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-lg px-4 py-2.5 text-sm font-mono border border-slate-800 focus:border-rose-500"
                />
              </div>
            </div>`;
const uiInputReplacement = `              <div>
                <label className="block text-[10px] font-bold text-rose-400 mb-1.5 uppercase">Total Exhaust Air ({flowUnit})</label>
                <input 
                  type="number" min="0" step="100"
                  value={sysExhaust}
                  onChange={(e) => setSysExhaust(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-lg px-4 py-2.5 text-sm font-mono border border-slate-800 focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Building Vol ({isMetric ? 'm³' : 'ft³'})</label>
                <input 
                  type="number" min="0" step="1000"
                  value={sysVolume}
                  onChange={(e) => setSysVolume(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-lg px-4 py-2.5 text-sm font-mono border border-slate-800 focus:border-indigo-500"
                />
              </div>
            </div>`;
content = content.replace(uiInputTarget, uiInputReplacement);

// 4. Show ACH in UI
const uiOutputTarget = `              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Building Net Flow</span>
                <span className={\`text-3xl font-black font-mono \${sysNetColor}\`}>
                  {systemResult.buildingPressure === 'Negative' ? '' : '+'}{systemResult.qNetBuilding}
                </span>
                <span className="text-xs font-bold text-slate-400 ml-1">{flowUnit}</span>
              </div>`;
const uiOutputReplacement = `              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Building Net Flow</span>
                <span className={\`text-3xl font-black font-mono \${sysNetColor}\`}>
                  {systemResult.buildingPressure === 'Negative' ? '' : '+'}{systemResult.qNetBuilding}
                </span>
                <span className="text-xs font-bold text-slate-400 ml-1">{flowUnit}</span>
                {systemResult.ach !== undefined && systemResult.ach > 0 && (
                  <p className="text-[10px] mt-1 font-mono text-slate-400">
                    {systemResult.buildingPressure === 'Positive' ? 'Exfiltration' : 'Infiltration'}: {systemResult.ach.toFixed(2)} ACH
                  </p>
                )}
              </div>`;
content = content.replace(uiOutputTarget, uiOutputReplacement);

fs.writeFileSync('src/components/AirBalanceCalc.tsx', content);
console.log('Patched AirBalanceCalc');
