const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', 'utf-8');

code = code.replace(
  "        qty: 1, designExhaust: 0\n      });\n      expect(result.status).toBe('BLOCKED');\n    });\n\n    it('Exhaust: blocks VERIFIED record using PUBLIC_REVIEW_DRAFT', () => {",
  "    it('Exhaust: blocks VERIFIED record using PUBLIC_REVIEW_DRAFT', () => {"
);

fs.writeFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', code);
