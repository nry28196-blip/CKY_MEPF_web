const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621ZoneService.ts', 'utf-8');

code = code.replace(
  /export interface ZoneVentilationInput {/g,
  `export interface ZoneVentilationInput {
  expectedStandard: string;
  expectedEdition: string;`
);

code = code.replace(
  /export interface ZoneVentilationResult {/g,
  `export interface ZoneVentilationResult {
  reason?: string;`
);

fs.writeFileSync('src/calculations/ventilation/Ashrae621ZoneService.ts', code);
