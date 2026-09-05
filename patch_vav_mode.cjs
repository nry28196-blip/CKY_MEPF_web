const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf-8');

code = code.replace(
  /export interface MultiZoneInput \{\n\s*zones: any\[\];\n\}/,
  `export interface MultiZoneInput {
  zones: any[];
  isVAV?: boolean;
}`
);

// We need to inject isVAV handling in the zone mapping.
// For simplified:
code = code.replace(
  /vpzMin: z\.input\.vpzMin !== '' && z\.input\.vpzMin !== undefined \? Number\(z\.input\.vpzMin\) : undefined/,
  `vpzMin: !inputs.isVAV ? Number(z.input.primaryAirflow) : (z.input.vpzMin !== '' && z.input.vpzMin !== undefined ? Number(z.input.vpzMin) : undefined)`
);

// For alternative:
code = code.replace(
  /vpzMin: z\.input\.vpzMin !== '' && z\.input\.vpzMin !== undefined \? Number\(z\.input\.vpzMin\) : undefined/,
  `vpzMin: !inputs.isVAV ? Number(z.input.primaryAirflow) : (z.input.vpzMin !== '' && z.input.vpzMin !== undefined ? Number(z.input.vpzMin) : undefined)`
);

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', code);
