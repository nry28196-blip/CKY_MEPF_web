const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(/reference: 'ASHRAE 62\.1 § 6\.2\.5\.3\.3'\n\s*\}\n\s*\{/g, "reference: 'ASHRAE 62.1 § 6.2.5.3.3'\n      },\n      {");
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
