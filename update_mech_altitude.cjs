const fs = require('fs');
let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// 1. Add state
const stateRegex = /const \[safetyFactor, setSafetyFactor\] = useState<number>\(10\);/;
content = content.replace(stateRegex, "const [safetyFactor, setSafetyFactor] = useState<number>(10);\n  const [altitude, setAltitude] = useState<number>(0);\n  const [useAltitudeAdj, setUseAltitudeAdj] = useState<boolean>(false);");

// 2. Add altitude UI
const uiRegex = /<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">/;
const newUi = `<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden mb-6">
              <div className="flex items-center justify-between mb-2">
                <TooltipLabel label="Altitude / Density Correction" tooltip="Adjust psychrometric mass-flow equations (sensible/latent) for non-sea-level air density." />
                <label className="flex items-center text-[10px] font-medium text-slate-400 cursor-pointer hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={useAltitudeAdj}
                    onChange={(e) => setUseAltitudeAdj(e.target.checked)}
                    className="mr-1.5 rounded border-slate-700 text-sky-500 focus:ring-sky-500 bg-slate-900"
                  />
                  Enable
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  disabled={!useAltitudeAdj}
                  value={altitude === 0 && !useAltitudeAdj ? '' : altitude}
                  onChange={(e) => {
                    if (useAltitudeAdj) setAltitude(e.target.value === '' ? 0 : Number(e.target.value));
                  }}
                  placeholder="Altitude"
                  className={\`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors \${
                    !useAltitudeAdj 
                      ? 'bg-slate-900/50 border-slate-800/50 text-slate-600' 
                      : 'bg-slate-950 border-slate-700 text-white focus:border-sky-500/50'
                  }\`}
                />
                <span className="text-xs text-slate-500">{isMetric ? 'm' : 'ft'}</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">`;

content = content.replace(uiRegex, newUi);

// 3. Update the calculation
const calcRegex = /const ventSensible = 1\.21 \* ventilationLps \* dT;\s*\/\/ Latent assumption: outdoor humidity ratio approx 0\.016, indoor 0\.009 -> dw = 0\.007\s*const dw = 0\.007;\s*const ventLatent = 3010 \* ventilationLps \* dw;\s*\/\/ 7\. Infiltration\s*const numVolume = numArea \* height;\s*const infiltrationLps = \(infiltrationACH \* numVolume \* 1000\) \/ 3600;\s*const infiltrationSensible = 1\.21 \* infiltrationLps \* dT;\s*const infiltrationLatent = 3010 \* infiltrationLps \* dw;/;

const newCalc = `// Altitude adjustment for air density
    const altMeters = isMetric ? altitude : altitude * 0.3048;
    const densityRatio = useAltitudeAdj ? Math.pow(1 - 2.25577e-5 * altMeters, 5.2559) : 1.0;
    
    // Adjusted psychrometric constants for sensible and latent heat based on air density
    const cpAir = 1.21 * densityRatio; 
    const hfgAir = 3010 * densityRatio;

    // 6. Ventilation (Sensible & Latent)
    const ventSensible = cpAir * ventilationLps * dT;
    // Latent assumption: outdoor humidity ratio approx 0.016, indoor 0.009 -> dw = 0.007
    const dw = 0.007; 
    const ventLatent = hfgAir * ventilationLps * dw;
    
    // 7. Infiltration
    const numVolume = numArea * height;
    const infiltrationLps = (infiltrationACH * numVolume * 1000) / 3600;
    const infiltrationSensible = cpAir * infiltrationLps * dT;
    const infiltrationLatent = hfgAir * infiltrationLps * dw;`;

content = content.replace(calcRegex, newCalc);

fs.writeFileSync('src/components/MechanicalCalc.tsx', content);
console.log('Updated MechanicalCalc');
