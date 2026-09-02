const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const target = `{/* System Audit Trail */}
          <div className="mt-6 pt-4 border-t border-slate-800/60">`;

const replace = `{systemResult.zdMax > 1.0 && (
            <div className="mt-6 pt-4 border-t border-slate-800/60">
              <EngineeringWarning 
                severity="error" 
                title="Critical System Failure: Zpz > 1.0" 
                reference="ASHRAE 62.1-2022 § 6.2.5.3.3"
              >
                One or more zones have a Maximum Zone Fraction (Zpz) greater than 1.0. This means the Minimum Primary Airflow (Vpz-min) is less than the Required Outdoor Air (Voz) for that zone. To resolve this, increase the Design Vpz or Vpz-min for the critical zone(s).
              </EngineeringWarning>
            </div>
          )}
          
          {/* System Audit Trail */}
          <div className="mt-6 pt-4 border-t border-slate-800/60">`;

content = content.replace(target, replace);
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Patched Ashrae621VentilationCalc.tsx for Zpz>1 warning");
