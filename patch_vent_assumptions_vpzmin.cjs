const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const target = `{systemPrimaryAirflow === '' && systemType === 'multi' && systemResult && (
              <li className="text-[10px] text-slate-400 font-mono flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>System Primary Airflow (Vps) was not provided. Assumed equal to sum of zone minimum primary airflows (ΣVpz-min = {Math.ceil(systemResult.sumVpzMin)} {flowUnit}).</span>
              </li>
            )}`;
const replace = `{systemPrimaryAirflow === '' && systemType === 'multi' && systemResult && (
              <li className="text-[10px] text-slate-400 font-mono flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>System Primary Airflow (Vps) was not provided. Assumed equal to sum of zone minimum primary airflows (ΣVpz-min = {Math.ceil(systemResult.sumVpzMin)} {flowUnit}).</span>
              </li>
            )}
            {zones.some(z => z.vpzMin === '') && systemType === 'multi-vav' && (
              <li className="text-[10px] text-slate-400 font-mono flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Zone Minimum Primary Airflow (Vpz-min) was not provided for one or more zones. Assumed equal to the zone's design primary airflow (Vpz).</span>
              </li>
            )}`;

content = content.replace(target, replace);

// Also need to fix the condition to show the box if zones.some(z => z.vpzMin === '') && systemType === 'multi-vav'
const targetCond = `{systemType === 'multi' && (systemPopulation === '' || systemPrimaryAirflow === '') && (`;
const replaceCond = `{systemType === 'multi' && (systemPopulation === '' || systemPrimaryAirflow === '' || (systemType === 'multi-vav' && zones.some(z => z.vpzMin === ''))) && (`;

content = content.replace(targetCond, replaceCond);
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Patched Ashrae621VentilationCalc for vpzMin assumption");
