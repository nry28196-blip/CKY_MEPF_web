import { describe, it, expect } from 'vitest';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';
import { Ashrae621ZoneService, ZoneVentilationInput } from '../../calculations/ventilation/Ashrae621ZoneService';
import { Ashrae621ExhaustService, ExhaustInput } from '../../calculations/ventilation/Ashrae621ExhaustService';
import { Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType, SourceType } from '../../data/ventilation/ashrae621/types';
import { AuditStatus } from '../../types';

// TEST FIXTURE ONLY — NOT AN ASSERTION THAT CURRENT ASHRAE 62.1 PRODUCTION DATA IS VERIFIED.
function createSyntheticVerifiedSpaceType(edition: string): Ashrae621SpaceType {
  return {
    id: `synthetic-office-${edition}`,
    name: 'Synthetic Verified Office',
    standard: 'ASHRAE 62.1',
    edition: edition,
    sourceType: SourceType.ASHRAE_PUBLISHED,
    verificationStatus: 'VERIFIED',
    revisionState: {
      source: SourceType.ASHRAE_PUBLISHED,
      standard: 'ASHRAE 62.1',
      edition: edition
    },
    revision: edition,
    verificationDate: '2025-01-01',
    reference: 'Synthetic Test Data',
    rpMetric: 2.5,
    rpImperial: 5.0,
    raMetric: 0.3,
    raImperial: 0.06,
    defaultOccupancyMetric: 5.4, defaultOccupancyImperial: 5.0, // per 100 m2
    provenance: {
      rp: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, revision: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test' },
      ra: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, revision: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test' },
      defaultOccupancy: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, revision: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test' },
      reference: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, revision: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test' }
    }
  };
}

function createSyntheticVerifiedEz(edition: string): Ashrae621Ez {
  return {
    id: `synthetic-ez-${edition}`,
    name: 'Synthetic Verified Ez',
    standard: 'ASHRAE 62.1',
    edition: edition,
    sourceType: SourceType.ASHRAE_PUBLISHED,
    verificationStatus: 'VERIFIED',
    revisionState: {
      source: SourceType.ASHRAE_PUBLISHED,
      standard: 'ASHRAE 62.1',
      edition: edition
    },
    verificationDate: '2025-01-01',
    reference: 'Synthetic Test Data',
    ez: 1.0,
    heatingApplicability: true,
    coolingApplicability: true,
    provenance: {
      ez: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, revision: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test' },
      applicability: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, revision: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test' },
      reference: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, revision: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test' }
    }
  };
}

function createSyntheticVerifiedExhaust(edition: string): Ashrae621ExhaustType {
  return {
    id: `synthetic-exhaust-${edition}`,
    name: 'Synthetic Verified Exhaust',
    standard: 'ASHRAE 62.1',
    edition: edition,
    sourceType: SourceType.ASHRAE_PUBLISHED,
    verificationStatus: 'VERIFIED',
    revisionState: {
      source: SourceType.ASHRAE_PUBLISHED,
      standard: 'ASHRAE 62.1',
      edition: edition
    },
    verificationDate: '2025-01-01',
    reference: 'Synthetic Test Data',
    rate: 25,
    unitType: 'L/s/unit',
    exhaustClass: 2,
    provenance: {
      rate: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, revision: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test' },
      exhaustClass: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, revision: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test' },
      reference: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, revision: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test' }
    }
  };
}

const editions = ['2019', '2022', '2025'];

describe('ASHRAE 62.1 PRODUCTION SAFETY AUTOMATED TESTS', () => {

  describe('A. SPACE TYPE PRODUCTION SAFETY', () => {
    editions.forEach(edition => {
      it(`blocks all unverified production SpaceType records in ${edition}`, () => {
        const spaces = StandardDataProvider.get621SpaceTypes(edition);
        const syntheticEz = createSyntheticVerifiedEz(edition);
        
        let checkedCount = 0;
        for (const space of spaces) {
          if (space.verificationStatus !== 'VERIFIED') {
            checkedCount++;
            // Check that the data itself is still unverified.
            // "Production ASHRAE 62.1-2025 numerical data remains NOT_VERIFIED."
            expect(space.verificationStatus).toBe('NOT_VERIFIED');

            const result = Ashrae621ZoneService.calculateZone({
              expectedStandard: 'ASHRAE 62.1',
              expectedEdition: edition,
              spaceType: space,
              area: 100,
              designOccupancy: 5,
              useDefaultOccupancy: false,
              ezConfig: syntheticEz
            });

            expect(result.status).toBe('BLOCKED');
            expect(result.vbz).toBeNull();
            expect(result.voz).toBeNull();
            expect(result.reason).toContain('blocked'); // Verify reason mentions blocked or unverified
          }
        }
        // Ensure we actually checked records (there should be many NOT_VERIFIED records)
        expect(checkedCount).toBeGreaterThan(0);
      });
    });
  });

  describe('B. EZ PRODUCTION SAFETY', () => {
    editions.forEach(edition => {
      it(`blocks all unverified production Ez records in ${edition}`, () => {
        const ezs = StandardDataProvider.get621EzValues(edition);
        const syntheticSpace = createSyntheticVerifiedSpaceType(edition);
        
        let checkedCount = 0;
        for (const ez of ezs) {
          if (ez.verificationStatus !== 'VERIFIED') {
            checkedCount++;
            expect(ez.verificationStatus).toBe('NOT_VERIFIED');

            const result = Ashrae621ZoneService.calculateZone({
              expectedStandard: 'ASHRAE 62.1',
              expectedEdition: edition,
              spaceType: syntheticSpace,
              area: 100,
              designOccupancy: 5,
              useDefaultOccupancy: false,
              ezConfig: ez
            });

            expect(result.status).toBe('BLOCKED');
            expect(result.vbz).toBeNull();
            expect(result.voz).toBeNull();
          }
        }
        expect(checkedCount).toBeGreaterThan(0);
      });
    });
  });

  describe('C. EXHAUST PRODUCTION SAFETY', () => {
    editions.forEach(edition => {
      it(`blocks all unverified production Exhaust records in ${edition} even with large design exhausts`, () => {
        const exhausts = StandardDataProvider.get621ExhaustRates(edition);
        
        let checkedCount = 0;
        for (const ex of exhausts) {
          if (ex.verificationStatus !== 'VERIFIED') {
            checkedCount++;
            expect(ex.verificationStatus).toBe('NOT_VERIFIED');

            const result = Ashrae621ExhaustService.calculate({
              expectedStandard: 'ASHRAE 62.1',
              expectedEdition: edition,
              exhaustType: ex,
              qty: 10,
              designExhaust: 9999
            });

            expect(result.status).toBe('BLOCKED');
            expect(result.requiredExhaust).toBeNull();
          }
        }
        expect(checkedCount).toBeGreaterThan(0);
      });
    });
  });

  describe('D. MATHEMATICAL SYNTHETIC TESTS', () => {
    it('calculates zone successfully with mathematical golden test (design occupancy)', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      const ez = createSyntheticVerifiedEz('2025');
      
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: space,
        area: 100, // 100 m2
        designOccupancy: 5, // 5 persons
        useDefaultOccupancy: false,
        ezConfig: ez
      });

      expect(result.status).toBe('PASS');
      // Vbp = 2.5 * 5 = 12.5
      expect(result.vbp).toBeCloseTo(12.5, 4);
      // Vba = 0.3 * 100 = 30.0
      expect(result.vba).toBeCloseTo(30.0, 4);
      // Vbz = 12.5 + 30.0 = 42.5
      expect(result.vbz).toBeCloseTo(42.5, 4);
      // Voz = 42.5 / 1.0 = 42.5
      expect(result.voz).toBeCloseTo(42.5, 4);

      // Verify statuses
      const vbzItem = result.auditTrail.find(a => a.symbol === 'Vbz');
      expect(vbzItem?.status).toBe(AuditStatus.DERIVED);
      const vozItem = result.auditTrail.find(a => a.symbol === 'Voz');
      expect(vozItem?.status).toBe(AuditStatus.DERIVED);
    });

    it('calculates zone successfully with synthetic default-occupancy test', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      const ez = createSyntheticVerifiedEz('2025');
      
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: space,
        area: 100, 
        designOccupancy: null,
        useDefaultOccupancy: true,
        ezConfig: ez
      });

      expect(result.status).toBe('PASS');
      // Pz = (100 / 100) * 5.4 = 5.4
      expect(result.pz).toBeCloseTo(5.4, 4);
      // Vbp = 5.4 * 2.5 = 13.5
      expect(result.vbp).toBeCloseTo(13.5, 4);
      // Vba = 100 * 0.3 = 30.0
      expect(result.vba).toBeCloseTo(30.0, 4);
      // Vbz = 13.5 + 30 = 43.5
      expect(result.vbz).toBeCloseTo(43.5, 4);
      expect(result.voz).toBeCloseTo(43.5, 4);
    });

    it('calculates exhaust arithmetic successfully using synthetic verified exhaust test', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        exhaustType: ex,
        qty: 2,
        designExhaust: 60
      });

      expect(result.status).toBe('PASS');
      expect(result.requiredExhaust).toBe(50); // 25 * 2
      expect(result.designExhaust).toBe(60);
    });
  });

  describe('E. PROVENANCE MISMATCH GATES', () => {
    it('blocks standard mismatch', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.standard = 'WRONG_STANDARD';
      
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: space,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: createSyntheticVerifiedEz('2025')
      });
      
      expect(result.status).toBe('BLOCKED'); // Must be BLOCKED for standard mismatch
    });

    it('blocks edition mismatch', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.edition = '2022';
      
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: space,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: createSyntheticVerifiedEz('2025')
      });
      
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks revision mismatch', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      if (space.revisionState) space.revisionState.edition = '2022';
      
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: space,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: createSyntheticVerifiedEz('2025')
      });
      
      expect(result.status).toBe('BLOCKED');
    });
  });

  describe('F. VERIFICATION DATE VALIDATION', () => {
    it('blocks missing verificationDate', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.verificationDate = '';
      if (space.provenance) space.provenance.rp.verificationDate = '';
      
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: space,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: createSyntheticVerifiedEz('2025')
      });
      
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks invalid date format', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.verificationDate = '2025'; // Invalid format
      if (space.provenance) space.provenance.rp.verificationDate = '2025';

      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: space,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: createSyntheticVerifiedEz('2025')
      });
      
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks invalid actual calendar date (e.g. 2025-99-99)', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.verificationDate = '2025-99-99'; 
      if (space.provenance) space.provenance.rp.verificationDate = '2025-99-99';

      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: space,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: createSyntheticVerifiedEz('2025')
      });
      
      expect(result.status).toBe('BLOCKED');
    });
  });

});
