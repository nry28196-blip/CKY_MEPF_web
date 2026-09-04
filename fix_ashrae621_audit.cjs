const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(
  "{ symbol: 'Eρ', name: 'Density Ratio', formula: 'ρ_actual / ρ_standard', value: densityRatio.toFixed(3) },\n                { symbol: 'Vot_actual', name: 'Density Corrected Required Outdoor Air', formula: 'Vot / Eρ', value: Math.ceil(systemResult.votActual || systemResult.vot), unit: flowUnit },",
  "{ symbol: 'Eρ', name: 'Density Ratio', formula: 'ρ_standard / ρ_actual', value: densityRatio.toFixed(3) },\n                { symbol: 'Vot_actual', name: 'Density Corrected Required Outdoor Air', formula: 'Vot × Eρ', value: Math.ceil(systemResult.votActual || systemResult.vot), unit: flowUnit },"
);

// We need to also check if we're rounding intermediate values.
// In the audit trail we see Math.ceil(systemResult.sumPz) etc. It says "Do not round intermediate engineering values"
// Is it rounding intermediate? Math.ceil(systemResult.sumPz) is just for display, so that's fine. 
// But wait, "Do not use Math.ceil() unless specifically required by the applicable standard. Do not round intermediate engineering values."
// Let's remove Math.ceil/round from the Audit trail values so we display them to 1 or 2 decimals.
code = code.replace(
  "value: Math.ceil(systemResult.sumPz)",
  "value: systemResult.sumPz.toFixed(1)"
);
code = code.replace(
  "value: Math.ceil(systemResult.ps)",
  "value: systemResult.ps.toFixed(1)"
);
code = code.replace(
  "value: Math.round(systemResult.vou)",
  "value: systemResult.vou.toFixed(1)"
);
code = code.replace(
  "value: Math.round(systemResult.vps)",
  "value: systemResult.vps.toFixed(1)"
);
code = code.replace(
  "value: Math.round(systemResult.vot)",
  "value: systemResult.vot.toFixed(1)"
);
code = code.replace(
  "value: Math.ceil(systemResult.votActual || systemResult.vot)",
  "value: (systemResult.votActual || systemResult.vot).toFixed(1)"
);

// For the single zone audit trail, we also need to check.

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
