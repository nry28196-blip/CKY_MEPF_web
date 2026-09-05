const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', 'utf-8');

code = code.replace(
  /export interface SimplifiedSystemInput \{\n\s*zones: SimplifiedZoneInput\[\];\n\s*systemPopulation\?: number \| null; \/\/ Ps\n\}/,
  `export interface SimplifiedSystemInput {
  zones: SimplifiedZoneInput[];
  systemPopulation?: number | null; // Ps
  isVAV?: boolean;
}`
);

code = code.replace(
  /\/\/ Calculate required Vpz-min for VAV systems \(1\.5 \* Voz\)\n\s*const requiredVpzMin = z\.zoneResult\.voz \* 1\.5;\n\s*if \(z\.vpzMin !== undefined\) \{\n\s*if \(z\.vpzMin < requiredVpzMin\) \{\n\s*status = 'FAIL';\n\s*error = \`Zone Vpz-min \\\(\\\$\{z\.vpzMin\.toFixed\(1\)\}\\\) is less than required 1\.5 \* Voz \\\(\\\$\{requiredVpzMin\.toFixed\(1\)\}\\\)\`;\n\s*\}\n\s*\} else \{\n\s*if \(status !== 'FAIL'\) \{\n\s*status = 'WARNING';\n\s*warning = 'One or more zones missing Vpz-min\. If this is a VAV system, you must provide Vpz-min\. Evaluated as constant volume\.';\n\s*\}\n\s*\}/,
  `// Calculate required Vpz-min for VAV systems (1.5 * Voz)
      const requiredVpzMin = z.zoneResult.voz * 1.5;
      if (z.vpzMin !== undefined) {
        if (input.isVAV !== false && z.vpzMin < requiredVpzMin) {
          status = 'FAIL';
          error = \`Zone Vpz-min (\${z.vpzMin.toFixed(1)}) is less than required 1.5 * Voz (\${requiredVpzMin.toFixed(1)})\`;
        }
      } else {
        if (status !== 'FAIL') {
          status = 'INCOMPLETE';
          warning = 'One or more zones missing Vpz-min. Missing required VAV data.';
        }
      }`
);

fs.writeFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', code);
