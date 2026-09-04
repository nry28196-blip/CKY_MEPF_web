const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/SystemPerformanceService.ts', 'utf-8');

code = code.replace(
  "const qSupplyActual = qSupplyStandard / densityRatio;",
  "const qSupplyActual = qSupplyStandard * densityRatio;"
);

// also fix standardTSP * densityRatio - Wait, if density decreases, static pressure decreases for the same mass flow? No, for the same ACTUAL volumetric flow rate, pressure drop is proportional to density.
// If actual volume increases by Erho, pressure drop is proportional to (velocity)^2 * density.
// So SP_actual = SP_standard * (Erho^2) / Erho = SP_standard * Erho.
// Erho = 1.204, so SP_actual = SP_standard * 1.204. Actually, if density is LOWER (0.83), Erho is 1.2.
// Wait, density is LOWER. Actual density = standard density / Erho.
// SP_actual = SP_standard * (Actual density / Standard density) * (Actual volume / Standard volume)^2
// SP_actual = SP_standard * (1/Erho) * (Erho)^2 = SP_standard * Erho.
// So SP_actual = SP_standard * Erho is mathematically correct!

fs.writeFileSync('src/calculations/ventilation/SystemPerformanceService.ts', code);
