const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf-8');

code = code.replace(
  /export interface MultiZoneInput \{\n\s*zones: any\[\];\n\s*isVAV\?: boolean;\n\}/,
  `export interface MultiZoneInput {
  zones: any[];
  isVAV?: boolean;
  alternativeConfig?: 'single-supply' | 'secondary-recirculation';
}`
);

// We need to map alternativeConfig to the alternative system calculate call.
code = code.replace(
  /const res = Ashrae621AlternativeSystemService\.calculate\(\{\n\s*zones: mappedZones,\n\s*systemPopulation,\n\s*vps: systemPrimaryAirflow\n\s*\}\);/,
  `const res = Ashrae621AlternativeSystemService.calculate({
         zones: mappedZones,
         systemPopulation,
         vps: systemPrimaryAirflow,
         config: inputs.alternativeConfig || 'single-supply'
       });`
);

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', code);
