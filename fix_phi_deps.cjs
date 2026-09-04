const fs = require('fs');
let code = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf-8');

code = code.replace(/phi,\s*edition: edition as "2019" \| "2022" \| "2025"\]\)/g, 'phi, edition])');

fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', code);
