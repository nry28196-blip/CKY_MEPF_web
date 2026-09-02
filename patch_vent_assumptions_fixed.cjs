const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const target = `{/* Multi-Zone System Results */}`;
const replace = `{/* Engineering Assumptions Display */}
      {systemType === 'multi' && (systemPopulation === '' || systemPrimaryAirflow === '') && (
        <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-4 shadow-lg animate-fade-in">
          <h3 className="text-xs font-bold text-amber-500 uppercase flex items-center mb-2">
            <Info className="w-4 h-4 mr-2" />
            Engineering Assumptions
          </h3>
          <ul className="space-y-1">
            {systemPopulation === '' && (
              <li className="text-[10px] text-slate-400 font-mono flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Peak System Population (Ps) was not provided. Assumed equal to sum of peak zone populations (ΣPz = {Math.ceil(zoneResults.reduce((sum, z) => sum + z.result.pz, 0))}). Diversity Ratio (D) = 1.00.</span>
              </li>
            )}
            {systemPrimaryAirflow === '' && systemType === 'multi' && systemResult && (
              <li className="text-[10px] text-slate-400 font-mono flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>System Primary Airflow (Vps) was not provided. Assumed equal to sum of zone minimum primary airflows (ΣVpz-min = {Math.ceil(systemResult.sumVpzMin)} {flowUnit}).</span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Multi-Zone System Results */}`;

content = content.replace(target, replace);
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Patched Ashrae621VentilationCalc for assumptions");
