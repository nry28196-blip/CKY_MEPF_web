const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', 'utf-8');

// The file got messed up around line 400.
// Let's just truncate the file before "describe('13. CHECK CHILD PROVENANCE INDEPENDENTLY'" and rewrite the rest.

let index = code.indexOf("describe('13. CHECK CHILD PROVENANCE INDEPENDENTLY'");
if (index === -1) {
  index = code.indexOf("describe('10. CONTRADICTORY VERIFICATION STATES', () => {");
}

let safeCode = code.substring(0, index);

// Close out whatever was open before 13
let tail = `
  describe('13. CHECK CHILD PROVENANCE INDEPENDENTLY', () => {
    it('Exhaust: blocks VERIFIED record using PUBLIC_REVIEW_DRAFT', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.sourceType = 3; // PUBLIC_REVIEW_DRAFT
      const result = require('../../calculations/ventilation/Ashrae621ExhaustService').Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 25
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('Exhaust: blocks VERIFIED record using UNKNOWN source', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.sourceType = 4; // UNKNOWN
      const result = require('../../calculations/ventilation/Ashrae621ExhaustService').Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 25
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('passes valid VERIFIED record using an accepted ASHRAE published source', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.sourceType = 1; // ASHRAE_PUBLISHED_ADDENDUM
      const result = require('../../calculations/ventilation/Ashrae621ExhaustService').Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 25
      });
      expect(result.status).toBe('PASS');
    });
  });
});
`;

fs.writeFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', safeCode + tail);
