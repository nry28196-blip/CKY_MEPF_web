const fs = require('fs');
let code = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf-8');

code = code.replace(/const \[phi,\s*edition: edition as "2019" \| "2022" \| "2025", setPhi\]/g, 'const [phi, setPhi]');

fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', code);
