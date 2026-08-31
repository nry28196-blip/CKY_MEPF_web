const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// Update VentilationCalc to accept onVentilationChange
code = code.replace('<VentilationCalc />', '<VentilationCalc onVentilationChange={setVentilationLps} />');

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
