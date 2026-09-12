const fs = require('fs');

const code = `import { describe, it, expect } from 'vitest';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';
import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';
import { Ashrae621ExhaustService } from '../../calculations/ventilation/Ashrae621ExhaustService';
import { SourceType, AshraeEdition } from '../../data/ventilation/ashrae621/types';
import { createSyntheticVerifiedSpaceType, createSyntheticVerifiedEz, createSyntheticVerifiedExhaust } from './test-fixtures';

const editions: AshraeEdition[] = ['2019', '2022', '2025'];

describe('ASHRAE 62.1 PRODUCTION SAFETY AUTOMATED TESTS', () => {
  describe('8. EXPLICIT "NO UNVERIFIED DATA CAN PASS" REGRESSION TEST', () => {
    editions.forEach(edition => {
      it(\`blocks all unverified production SpaceType records in \${edition}\`, () => {
        const spaces = StandardDataProvider.get621SpaceTypes(edition);
        const syntheticEz = createSyntheticVerifiedEz(edition);
        let checkedCount = 0;
        for (const space of spaces) {
          if (space.verificationStatus !== 'VERIFIED') {
            checkedCount++;
            expect(space.verificationStatus).toBe('NOT_VERIFIED');
            const result = Ashrae621ZoneService.calculateZone({
              expectedStandard: 'ASHRAE 62.1', expectedEdition: edition, spaceType: space,
              area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: syntheticEz
            });
            expect(result.status).toBe('BLOCKED');
            expect(result.vbz).toBeNull();
            expect(result.voz).toBeNull();
          }
        }
        expect(checkedCount).toBeGreaterThan(0);
      });

      it(\`blocks all unverified production Ez records in \${edition}\`, () => {
        const ezs = StandardDataProvider.get621EzValues(edition);
        const syntheticSpace = createSyntheticVerifiedSpaceType(edition);
        let checkedCount = 0;
        for (const ez of ezs) {
          if (ez.verificationStatus !== 'VERIFIED') {
            checkedCount++;
            expect(ez.verificationStatus).toBe('NOT_VERIFIED');
            const result = Ashrae621ZoneService.calculateZone({
              expectedStandard: 'ASHRAE 62.1', expectedEdition: edition, spaceType: syntheticSpace,
              area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ez
            });
            expect(result.status).toBe('BLOCKED');
            expect(result.vbz).toBeNull();
          }
        }
        expect(checkedCount).toBeGreaterThan(0);
      });

      it(\`blocks all unverified production Exhaust records in \${edition} even with large design exhausts\`, () => {
        const exhausts = StandardDataProvider.get621ExhaustRates(edition);
        let checkedCount = 0;
        for (const ex of exhausts) {
          if (ex.verificationStatus !== 'VERIFIED') {
            checkedCount++;
            expect(ex.verificationStatus).toBe('NOT_VERIFIED');
            const result = Ashrae621ExhaustService.calculate({
              expectedStandard: 'ASHRAE 62.1', expectedEdition: edition, exhaustType: ex,
              qty: 10, designExhaust: 9999
            });
            expect(result.status).toBe('BLOCKED');
            expect(result.requiredExhaust).toBeNull();
          }
        }
        expect(checkedCount).toBeGreaterThan(0);
      });
    });
  });

  describe('9. STANDARD / EDITION / REVISION MISMATCH TESTS', () => {
    it('blocks standard mismatch', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.standard = 'WRONG STANDARD';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks edition mismatch', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.edition = '2022';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks revision mismatch', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.revisionState.edition = '2019';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });
  });

  describe('10. VERIFICATION-DATE TESTS', () => {
    it('blocks missing verificationDate', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.verificationDate = undefined;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks invalid format', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.verificationDate = '2025';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks invalid calendar date', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.verificationDate = '2025-99-99';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('passes valid date', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.verificationDate = '2025-01-01';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('PASS');
    });
  });

  describe('11. CONTRADICTORY VERIFICATION TESTS', () => {
    it('blocks parent NOT_VERIFIED + child VERIFIED', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.verificationStatus = 'NOT_VERIFIED';
      // child is VERIFIED from fixture
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks parent VERIFIED + child NOT_VERIFIED', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      if (space.provenance?.rp) {
        space.provenance.rp.verificationStatus = 'NOT_VERIFIED';
      }
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks VERIFIED record with PUBLIC_REVIEW_DRAFT source', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.sourceType = SourceType.PUBLIC_REVIEW_DRAFT;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks VERIFIED record with UNKNOWN source', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.sourceType = SourceType.UNKNOWN;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks VERIFIED record with non-ASHRAE source', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.sourceType = SourceType.PROJECT_SPECIFICATION;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('passes fully valid VERIFIED record with accepted ASHRAE published source', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.sourceType = SourceType.ASHRAE_PUBLISHED_ADDENDUM;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('PASS');
    });
  });

  describe('12. MATHEMATICAL SYNTHETIC TESTS (VERIFIED FIXTURES ONLY)', () => {
    it('calculates zone successfully with mathematical golden test (design occupancy)', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      const ez = createSyntheticVerifiedEz('2025');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ez
      });
      expect(result.status).toBe('PASS');
      expect(result.vbp).toBeCloseTo(12.5, 4);
      expect(result.vba).toBeCloseTo(30.0, 4);
      expect(result.vbz).toBeCloseTo(42.5, 4);
      expect(result.voz).toBeCloseTo(42.5, 4);
    });

    it('calculates zone successfully with synthetic default-occupancy test', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      const ez = createSyntheticVerifiedEz('2025');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: null, useDefaultOccupancy: true, ezConfig: ez
      });
      expect(result.status).toBe('PASS');
    });

    it('calculates exhaust arithmetic successfully using synthetic verified exhaust test', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 2, designExhaust: 60
      });
      expect(result.status).toBe('PASS');
      expect(result.requiredExhaust).toBe(50);
      expect(result.designExhaust).toBe(60);
    });
  });
});
`
fs.writeFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', code);
