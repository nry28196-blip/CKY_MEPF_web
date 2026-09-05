const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(
  /vpzMin: number \| ''; \/\/ Minimum primary airflow \(Vpz-min\) for VAV/,
  `vpzMin: number | ''; // Minimum primary airflow (Vpz-min) for VAV
    ep?: number | '';
    er?: number | '';`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
