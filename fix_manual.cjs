const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', 'utf-8');

code = code.replace(
  "      area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')\n    \n\n    it('blocks edition mismatch independently', () => {",
  "      area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')\n      });\n      expect(result.status).toBe('BLOCKED');\n    });\n    it('blocks edition mismatch independently', () => {"
);

fs.writeFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', code);
