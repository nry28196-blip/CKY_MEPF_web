const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', 'utf-8');

code = code.replace(
  "      if (z.vpzMin !== undefined && z.vpzMin > 0) {\n        if (z.vpzMin < requiredVpzMin) {\n          status = 'FAIL';\n          error = `Zone Vpz-min (${z.vpzMin.toFixed(1)}) is less than required 1.5 * Voz (${requiredVpzMin.toFixed(1)})`;\n        }\n      }",
  `      if (z.vpzMin !== undefined) {
        if (z.vpzMin < requiredVpzMin) {
          status = 'FAIL';
          error = \`Zone Vpz-min (\${z.vpzMin.toFixed(1)}) is less than required 1.5 * Voz (\${requiredVpzMin.toFixed(1)})\`;
        }
      } else {
        if (status !== 'FAIL') {
          status = 'WARNING';
          warning = 'One or more zones missing Vpz-min. If this is a VAV system, you must provide Vpz-min. Evaluated as constant volume.';
        }
      }`
);

fs.writeFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', code);
