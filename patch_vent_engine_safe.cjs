const fs = require('fs');
let code = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf-8');

code = code.replace(/zone: \{\n\s*spaceType,\n\s*area: areaM2,\n\s*designOccupancy: z.occupants === '' \? null : z.occupants,\n\s*useDefaultOccupancy: z.useDefaultOccupancy,\n\s*ezConfig\n\s*\}/g, `zone: {
          expectedStandard: 'ASHRAE 62.1',
          expectedEdition: input.standardEdition || '2025',
          spaceType,
          area: areaM2,
          designOccupancy: z.occupants === '' ? null : z.occupants,
          useDefaultOccupancy: z.useDefaultOccupancy,
          ezConfig
        }`);

code = code.replace(/const zoneInputs = input\.zones\.map\(z => \(\{/g, `const expectedStandard = 'ASHRAE 62.1';\n    const expectedEdition = input.standardEdition || '2025';\n    const zoneInputs = input.zones.map(z => ({`);

code = code.replace(/spaceType: spaceTypes\.find\(s => s\.id === z\.spaceTypeId\) \|\| null,\n\s*area: isMetric \? z\.area : ft2ToM2\(z\.area\),\n\s*designOccupancy: z\.occupants === '' \? null : z\.occupants,\n\s*useDefaultOccupancy: z\.useDefaultOccupancy,\n\s*ezConfig: ezValues\.find\(e => e\.id === z\.ezId\) \|\| null/g, `expectedStandard,
      expectedEdition,
      spaceType: spaceTypes.find(s => s.id === z.spaceTypeId) || null,
      area: isMetric ? z.area : ft2ToM2(z.area),
      designOccupancy: z.occupants === '' ? null : z.occupants,
      useDefaultOccupancy: z.useDefaultOccupancy,
      ezConfig: ezValues.find(e => e.id === z.ezId) || null`);

fs.writeFileSync('src/lib/VentilationEngine.ts', code);
