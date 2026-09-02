const fs = require('fs');

let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// We have multiple instances of the system-level inputs due to layout duplicated blocks.
// I will patch them globally.

const sysPopTarget = /<input[^>]*value=\{systemPopulation\}[^>]*onChange=\{\(e\) => setSystemPopulation[^\}]*\}[^>]*\/>/g;
const sysPopReplacement = `<ValidatedInput 
                type="number" min={0} placeholder="Defaults to ΣPz"
                max={Math.ceil(zoneResults.reduce((sum, z) => sum + z.result.pz, 0))}
                errorMsg="System Population (Ps) cannot exceed the sum of peak zone populations per 62.1-2025 (D ≤ 1.0)"
                value={systemPopulation}
                onChange={(e) => setSystemPopulation(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-sky-500"
              />`;

content = content.replace(sysPopTarget, sysPopReplacement);

const sysVpsTarget = /<input[^>]*value=\{systemPrimaryAirflow\}[^>]*onChange=\{\(e\) => setSystemPrimaryAirflow[^\}]*\}[^>]*\/>/g;
const sysVpsReplacement = `<ValidatedInput 
                type="number" min={systemResult ? Math.ceil(systemResult.sumVpzMin) : 0} placeholder="Defaults to ΣVpz-min"
                errorMsg="System Primary Airflow (Vps) must be ≥ sum of zone minimum primary airflows (ΣVpz-min)"
                value={systemPrimaryAirflow}
                onChange={(e) => setSystemPrimaryAirflow(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-sky-500"
              />`;
content = content.replace(sysVpsTarget, sysVpsReplacement);


fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Patched ALL remaining inputs");
