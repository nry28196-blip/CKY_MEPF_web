const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(
  /onVentilationChange\(systemResult\.votActual \|\| systemResult\.vot, \{ systemType: 'multi', systemResult \}\);/,
  `onVentilationChange((systemResult.votActual || systemResult.vot) ?? 0, { systemType: 'multi', systemResult });`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
