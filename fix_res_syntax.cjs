const fs = require('fs');
let code = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf-8');

// The bad sed replaced 'phi' with 'phi,\n          edition: edition as "2019" | "2022" | "2025"'
// Let's reverse it everywhere except inside calculateVentilation
code = code.replace(/value=\{phi,\s*edition: edition as "2019" \| "2022" \| "2025"\}/g, 'value={phi}');
code = code.replace(/value: phi,\s*edition: edition as "2019" \| "2022" \| "2025",/g, 'value: phi,');
code = code.replace(/setPhi\(phi,\s*edition: edition as "2019" \| "2022" \| "2025"\)/g, 'setPhi(phi)');

fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', code);
