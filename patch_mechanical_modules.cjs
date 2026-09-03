const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

code = code.replace(
  "export type SubTab = 'cooling' | 'ventilation' | 'exhaust' | 'airBalance' | 'iaq' | 'ductSizing' | 'fanDuty' | 'formulas';",
  "export type SubTab = 'cooling' | 'ventilation' | 'iaq' | 'ductSizing' | 'fanDuty' | 'formulas';"
);

code = code.replace(
  "export const mechanicalModules = [\n  { id: 'cooling', label: 'Simplified Cooling Load Estimate' },\n  { id: 'ventilation', label: 'Ventilation' },\n  { id: 'exhaust', label: 'Exhaust' },\n  { id: 'airBalance', label: 'Air Balance' },\n  { id: 'iaq', label: 'CO₂ / DCV Engineering Analysis' },\n  { id: 'ductSizing', label: 'Duct Design' },\n  { id: 'fanDuty', label: 'Fan Duty' },\n  { id: 'formulas', label: 'References' }\n];",
  "export const mechanicalModules = [\n  { id: 'cooling', label: 'Simplified Cooling Load Estimate' },\n  { id: 'ventilation', label: 'Ventilation' },\n  { id: 'iaq', label: 'CO₂ / DCV Engineering Analysis' },\n  { id: 'ductSizing', label: 'Duct Design' },\n  { id: 'fanDuty', label: 'Fan Duty' },\n  { id: 'formulas', label: 'References' }\n];"
);

// We need to check if there are explicit renders for 'exhaust' and 'airBalance' in MechanicalCalc that we need to remove or leave alone.
// Because the prompt says: "The calculation components/services for Exhaust and Air Balance must remain available through the Ventilation section."
// And "Existing Exhaust calculation functionality still works."

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Patched mechanicalModules");
