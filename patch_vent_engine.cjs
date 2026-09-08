const fs = require('fs');
let code = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf-8');
code = code.replace(/const input: SingleZoneInput = \{/g, "const edition = input.standardEdition || '2025';\n      const expectedStandard = 'ASHRAE 62.1';\n      const input: SingleZoneInput = {");
code = code.replace(/zone: \{\n          spaceType,\n          area: areaM2,\n          designOccupancy: z.occupants === '' \? null : z.occupants,\n          useDefaultOccupancy: z.useDefaultOccupancy,\n          ezConfig\n        \}/g, "zone: {\n          expectedStandard,\n          expectedEdition: edition,\n          spaceType,\n          area: areaM2,\n          designOccupancy: z.occupants === '' ? null : z.occupants,\n          useDefaultOccupancy: z.useDefaultOccupancy,\n          ezConfig\n        }");
// wait, wait. The patch script matches literal strings. 
// Let's do it safely.
fs.writeFileSync('patch_vent_engine_safe.cjs', `
const fs = require('fs');
let code = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf-8');

code = code.replace(
  /Ashrae621ZoneService\\.calculateZone\\(input\\.zone\\)/g,
  "Ashrae621ZoneService.calculateZone(input.zone)"
);

code = code.replace(/zone: \\{\\s*spaceType,\\s*area: areaM2,\\s*designOccupancy: (.*?),\\s*useDefaultOccupancy: (.*?),\\s*ezConfig\\s*\\}/, \`zone: {
          expectedStandard: 'ASHRAE 62.1',
          expectedEdition: input.standardEdition || '2025',
          spaceType,
          area: areaM2,
          designOccupancy: z.occupants === '' ? null : z.occupants,
          useDefaultOccupancy: z.useDefaultOccupancy,
          ezConfig
        }\`);

code = code.replace(/Ashrae621ZoneService\\.calculateZone\\(z\\)/g, "Ashrae621ZoneService.calculateZone(z)");
// for multi zone:
code = code.replace(/const zoneInputs = input\\.zones\\.map\\(z => \\(\\{/, \`const expectedStandard = 'ASHRAE 62.1';\\n    const expectedEdition = input.standardEdition || '2025';\\n    const zoneInputs = input.zones.map(z => ({\`);
code = code.replace(/spaceType: spaceTypes\\.find\\(s => s\\.id === z\\.spaceTypeId\\) \\|\\| null,\\s*area: (.*?),\\s*designOccupancy: (.*?),\\s*useDefaultOccupancy: (.*?),\\s*ezConfig: ezValues\\.find\\(e => e\\.id === z\\.ezId\\) \\|\\| null/g, \`expectedStandard,
      expectedEdition,
      spaceType: spaceTypes.find(s => s.id === z.spaceTypeId) || null,
      area: isMetric ? z.area : UnitConversionService.ft2ToM2(z.area),
      designOccupancy: z.occupants === '' ? null : z.occupants,
      useDefaultOccupancy: z.useDefaultOccupancy,
      ezConfig: ezValues.find(e => e.id === z.ezId) || null\`);


fs.writeFileSync('src/lib/VentilationEngine.ts', code);
`);
