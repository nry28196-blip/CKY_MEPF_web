const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(/ASHRAE 62\.1 Eq\. 6\.2\.2\.1/g, 'ASHRAE 62.1-${edition} Eq. 6.2.2.1');
code = code.replace(/ASHRAE 62\.1 Eq\. 6\.2\.2\.3/g, 'ASHRAE 62.1-${edition} Eq. 6.2.2.3');

// For the system equations in the audit trail:
code = code.replace(/Eq\. 6\.2\.5\.3\.1/g, 'Eq. 6.2.5.3.1');
code = code.replace(/reference: 'Eq\. 6\.2\.5\.3'/g, 'reference: `ASHRAE 62.1-${edition} Eq. 6.2.5.3`');
code = code.replace(/reference: 'Eq\. 6\.2\.5\.3\.1'/g, 'reference: `ASHRAE 62.1-${edition} Eq. 6.2.5.3.1`');
code = code.replace(/reference: 'Eq\. 6\.2\.5\.4\.1 \/ App\. A'/g, 'reference: `ASHRAE 62.1-${edition} App. A`');
code = code.replace(/reference: 'Eq\. 6\.2\.5\.1'/g, 'reference: `ASHRAE 62.1-${edition} Eq. 6.2.5.1`');

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
