const fs = require('fs');
let code = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf-8');

// I will just do a simple replacement for the call to calculateVentilation, which is now calculateWholeDwelling
code = code.replace(
  'const engineResult = Ashrae622Service.calculateVentilation',
  'const engineResult = Ashrae622Service.calculateWholeDwelling'
);

fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', code);
