const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621ZoneService.ts', 'utf-8');

code = code.replace(
  "    const rp = input.spaceType.rpMetric || 0;\n    const ra = input.spaceType.raMetric || 0;",
  "    const rp = input.spaceType.rpMetric !== undefined ? input.spaceType.rpMetric : 0;\n    const ra = input.spaceType.raMetric !== undefined ? input.spaceType.raMetric : 0;"
);

code = code.replace(
  "      const defaultDensity = input.spaceType.defaultOccupancyMetric || 0;",
  "      const defaultDensity = input.spaceType.defaultOccupancyMetric !== undefined ? input.spaceType.defaultOccupancyMetric : 0;"
);

code = code.replace(
  "    const ez = input.ezConfig?.ez || 1.0;",
  "    const ez = input.ezConfig?.ez !== undefined ? input.ezConfig.ez : 1.0;"
);

fs.writeFileSync('src/calculations/ventilation/Ashrae621ZoneService.ts', code);
