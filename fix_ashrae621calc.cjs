const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

// Replace "densityRatio: undefined" back to "densityRatio" globally
code = code.replace(/densityRatio: undefined/g, 'densityRatio');

// In calculateZoneVentilation, it has:
//        isMetric,
//        densityRatio
//      };
// Let's remove densityRatio from that object literal.
code = code.replace(/isMetric,\s*densityRatio\s*\};/g, 'isMetric\n      };');

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
