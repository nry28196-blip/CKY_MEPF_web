const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', 'utf-8');

code = code.replace(
  "    });\n  });\n      \n    \n      expect(result.status).toBe('BLOCKED');\n    });\n\n    it('Exhaust: blocks VERIFIED record using PUBLIC_REVIEW_DRAFT', () => {",
  "    });\n  });\n\n  describe('13. CHECK CHILD PROVENANCE INDEPENDENTLY', () => {\n    it('Exhaust: blocks VERIFIED record using PUBLIC_REVIEW_DRAFT', () => {"
);

fs.writeFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', code);
