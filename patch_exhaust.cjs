const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', 'utf-8');

const standardEditionMismatches = `
    it('blocks Exhaust standard mismatch independently', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.standard = 'WRONG_STANDARD';
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 0
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks Exhaust edition mismatch independently', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.edition = '2022';
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 0
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks Exhaust revision mismatch independently', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.revisionState = { ...ex.revisionState, edition: '2022', baseEdition: '2022' };
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 0
      });
      expect(result.status).toBe('BLOCKED');
    });
`;

code = code.replace(
  "  describe('6. POSITIVE VALID-VERIFICATION-DATE TEST & DATE FAILURES', () => {",
  standardEditionMismatches + "\n  describe('6. POSITIVE VALID-VERIFICATION-DATE TEST & DATE FAILURES', () => {"
);


const verificationDateMismatches = `
    it('Exhaust: passes with a valid verificationDate', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 0
      });
      expect(result.status).toBe('PASS');
    });

    it('Exhaust: blocks missing verificationDate', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.verificationDate = '';
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 0
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('Exhaust: blocks invalid date format', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.verificationDate = '2025';
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 0
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('Exhaust: blocks invalid actual calendar date (e.g. 2025-99-99)', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.verificationDate = '2025-99-99';
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 0
      });
      expect(result.status).toBe('BLOCKED');
    });
`;

code = code.replace(
  "  describe('10. CONTRADICTORY VERIFICATION STATES', () => {",
  verificationDateMismatches + "\n  describe('10. CONTRADICTORY VERIFICATION STATES', () => {"
);

const contradictoryStates = `
    it('Exhaust: blocks NOT_VERIFIED record with notes claiming "verified"', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.verificationStatus = 'NOT_VERIFIED';
      ex.notes = 'This data was manually verified by John.';
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 0
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('Exhaust: blocks VERIFIED record using PUBLIC_REVIEW_DRAFT', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.sourceType = SourceType.PUBLIC_REVIEW_DRAFT; // Incompatible with VERIFIED
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 0
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('Exhaust: blocks VERIFIED record using UNKNOWN source', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.sourceType = SourceType.UNKNOWN;
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 0
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('Exhaust: passes valid VERIFIED record using an accepted ASHRAE published source', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.sourceType = SourceType.ASHRAE_PUBLISHED_ADDENDUM; // Valid
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 1, designExhaust: 0
      });
      expect(result.status).toBe('PASS');
    });
`;

code = code.replace(
  "  describe('13. CHECK CHILD PROVENANCE INDEPENDENTLY', () => {",
  contradictoryStates + "\n  describe('13. CHECK CHILD PROVENANCE INDEPENDENTLY', () => {"
);


fs.writeFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', code);
