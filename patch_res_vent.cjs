const fs = require('fs');
let code = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf-8');

code = code.replace(
  /edition: edition as "2019" \| "2022" \| "2025"/,
  `edition: edition as "2019" | "2022" | "2025",\n          localExhaustDeficit: 0`
);

fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', code);
