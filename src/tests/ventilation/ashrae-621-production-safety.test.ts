import { describe, it, expect } from 'vitest';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';
import { Ashrae621ZoneService, ZoneVentilationInput } from '../../calculations/ventilation/Ashrae621ZoneService';
import { Ashrae621ExhaustService, ExhaustInput } from '../../calculations/ventilation/Ashrae621ExhaustService';
import { Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType, SourceType } from '../../data/ventilation/ashrae621/types';
import { AuditStatus } from '../../types';

type AshraeEdition = '2019' | '2022' | '2025';

function createSyntheticVerifiedSpaceType(edition: AshraeEdition): Ashrae621SpaceType {
  return {
    id: `synthetic-office-${edition}`,
    name: 'Synthetic Verified Office',
    category: 'Test',
    standard: 'ASHRAE 62.1',
    edition: edition,
    sourceType: SourceType.ASHRAE_PUBLISHED,
    verificationStatus: 'VERIFIED',
    revisionState: {
      source: SourceType.ASHRAE_PUBLISHED,
      standard: 'ASHRAE 62.1',
      edition: edition,
      baseEdition: edition,
      publishedAddendaApplied: [],
      publishedErrataApplied: [],
      verificationDate: '2025-01-01'
    },
    verificationDate: '2025-01-01',
    reference: 'Synthetic Test Data',
    units: 'Test',
    exhaustRequired: false,
    notes: 'Test',
    rpMetric: 2.5,
    raMetric: 0.3,
    defaultOccupancyMetric: 5.4,
    provenance: {
      rp: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition },
      ra: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition },
      defaultOccupancy: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition },
      reference: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition }
    }
  };
}

function createSyntheticVerifiedEz(edition: AshraeEdition): Ashrae621Ez {
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
      edition: edition,
      baseEdition: edition,
      publishedAddendaApplied: [],
      publishedErrataApplied: [],
      verificationDate: '2025-01-01'
    },
    verificationDate: '2025-01-01',
    reference: 'Synthetic Test Data',
    ez: 1.0,
    configuration: 'Test',
    applicableCondition: 'Test',
    supplyArrangement: 'Test',
    returnArrangement: 'Test',
    provenance: {
      ez: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition },
      applicability: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition },
      reference: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition }
    }
  };
}

function createSyntheticVerifiedExhaust(edition: AshraeEdition): Ashrae621ExhaustType {
  return {
    id: `synthetic-exhaust-${edition}`,
    name: 'Synthetic Verified Exhaust',
    category: 'Test',
    operatingCondition: 'Test',
    standard: 'ASHRAE 62.1',
    edition: edition,
    sourceType: SourceType.ASHRAE_PUBLISHED,
    verificationStatus: 'VERIFIED',
    revisionState: {
      source: SourceType.ASHRAE_PUBLISHED,
      standard: 'ASHRAE 62.1',
      edition: edition,
      baseEdition: edition,
      publishedAddendaApplied: [],
      publishedErrataApplied: [],
      verificationDate: '2025-01-01'
    },
    verificationDate: '2025-01-01',
    reference: 'Synthetic Test Data',
    rate: 25,
    unitType: 'fixture',
    exhaustClass: 2
  };
}

const editions: AshraeEdition[] = ['2019', '2022', '2025'];

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
            expect(space.verificationStatus).toBe('NOT_VERIFIED');
            const result = Ashrae621ZoneService.calculateZone({
              expectedStandard: 'ASHRAE 62.1', expectedEdition: edition, spaceType: space,
              area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: syntheticEz
            });
            expect(result.status).toBe('BLOCKED');
            expect(result.vbz).toBeNull();
            expect(result.voz).toBeNull();
            expect(result.reason).toContain('blocked');
          }
        }
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
              expectedStandard: 'ASHRAE 62.1', expectedEdition: edition, spaceType: syntheticSpace,
              area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ez
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

  describe('D. MATHEMATICAL SYNTHETIC TESTS', () => {
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
      const vbzItem = result.auditTrail.find(a => a.symbol === 'Vbz');
      expect(vbzItem?.status).toBe(AuditStatus.DERIVED);
      const vozItem = result.auditTrail.find(a => a.symbol === 'Voz');
      expect(vozItem?.status).toBe(AuditStatus.DERIVED);
    });

    it('calculates zone successfully with synthetic default-occupancy test', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      const ez = createSyntheticVerifiedEz('2025');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: null, useDefaultOccupancy: true, ezConfig: ez
      });
      expect(result.status).toBe('PASS');
      expect(result.pz).toBeCloseTo(5.4, 4);
      expect(result.vbp).toBeCloseTo(13.5, 4);
      expect(result.vba).toBeCloseTo(30.0, 4);
      expect(result.vbz).toBeCloseTo(43.5, 4);
      expect(result.voz).toBeCloseTo(43.5, 4);
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

  describe('E. PROVENANCE MISMATCH GATES', () => {
    it('blocks standard mismatch', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.standard = 'WRONG_STANDARD' as any;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });
    it('blocks edition mismatch', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.edition = '2022' as any;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });
    it('blocks revision mismatch', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      if (space.revisionState) space.revisionState.edition = '2022' as any;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
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
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });
    it('blocks invalid date format', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.verificationDate = '2025';
      if (space.provenance) space.provenance.rp.verificationDate = '2025';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });
    it('blocks invalid actual calendar date (e.g. 2025-99-99)', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.verificationDate = '2025-99-99'; 
      if (space.provenance) space.provenance.rp.verificationDate = '2025-99-99';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });
  });
});
