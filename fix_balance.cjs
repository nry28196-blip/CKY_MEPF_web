const fs = require('fs');

let calcCode = fs.readFileSync('src/components/AirBalanceCalc.tsx', 'utf8');
calcCode = calcCode.replace(/supplyAir,\s*exhaustAir,\s*returnAir,\s*transferIn/g, "qSupply: supplyAir, qExhaust: exhaustAir, qReturn: returnAir, qTransferIn: transferIn");
calcCode = calcCode.replace(/result\.netAirflow/g, "result.qNet");
fs.writeFileSync('src/components/AirBalanceCalc.tsx', calcCode);

let valCode = fs.readFileSync('src/calculations/validation/VentilationValidator.ts', 'utf8');
valCode = valCode.replace(/balance\.netAirflow/g, "balance.qNet");
fs.writeFileSync('src/calculations/validation/VentilationValidator.ts', valCode);
