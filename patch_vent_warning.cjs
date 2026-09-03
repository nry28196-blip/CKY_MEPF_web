const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

code = code.replace(
  "Assumed equal to the max(30% of Vpz, Voz).",
  "Assumed equal to Vpz (Constant Volume condition). If this is a VAV system, you must manually provide the minimum primary airflow."
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
console.log("Patched ventilation warning message");
