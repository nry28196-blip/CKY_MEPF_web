const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const target1 = `{zones.some(z => z.vpzMin === '') && systemType === 'multi-vav' && (
              <li className="text-[10px] text-slate-400 font-mono flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Zone Minimum Primary Airflow (Vpz-min) was not provided for one or more zones. Assumed equal to the zone's design primary airflow (Vpz).</span>
              </li>
            )}`;
            
const replace1 = `{zones.some(z => z.vpzMin === '') && systemType === 'multi' && (
              <li className="text-[10px] text-slate-400 font-mono flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Zone Minimum Primary Airflow (Vpz-min) was not provided for one or more zones. Assumed equal to the zone's design primary airflow (Vpz).</span>
              </li>
            )}`;

content = content.replace(target1, replace1);

const target2 = `{systemType === 'multi' && (systemPopulation === '' || systemPrimaryAirflow === '' || (systemType === 'multi-vav' && zones.some(z => z.vpzMin === ''))) && (`;
const replace2 = `{systemType === 'multi' && (systemPopulation === '' || systemPrimaryAirflow === '' || zones.some(z => z.vpzMin === '')) && (`;

content = content.replace(target2, replace2);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Fixed vpzMin assumption condition");
