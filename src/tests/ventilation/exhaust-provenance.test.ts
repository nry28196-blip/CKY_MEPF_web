import { SourceType } from '../../data/ventilation/ashrae621/types';
import { describe, it, expect } from 'vitest';
import { Ashrae621ExhaustService } from '../../calculations/ventilation/Ashrae621ExhaustService';
import { Ashrae621ExhaustType } from '../../data/ventilation/ashrae621/types';
import { ASHRAE_621_2025_EXHAUST_RATES } from '../../data/ventilation/ashrae621/2025/data';

const createFixture = (overrides: Partial<Ashrae621ExhaustType> = {}): Ashrae621ExhaustType => ({
  id: 'fixture-01',
  name: 'Test Fixture Only - NOT AN ASSERTION THAT CURRENT ASHRAE 62.1-2025 PRODUCTION DATA IS VERIFIED',
  category: 'Educational',
  operatingCondition: 'continuous',
  rate: 25,
  unitType: 'fixture',
  exhaustClass: 1,
  standard: 'ASHRAE 62.1',
  edition: '2025',
  sourceType: SourceType.ASHRAE_PUBLISHED,
  verificationStatus: 'VERIFIED',
  revisionState: {
    source: SourceType.ASHRAE_PUBLISHED,
    standard: 'ASHRAE 62.1',
    edition: '2025',
    baseEdition: '2025',
    publishedAddendaApplied: [],
    publishedErrataApplied: [],
    verificationDate: ''
  },
  reference: 'Synthetic reference',
  verificationDate: '2026-09-10',
  ...overrides
});

describe('Exhaust Provenance Validation', () => {

  it('A. VERIFIED ASHRAE exhaust source => PASS when design exhaust >= required exhaust', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture(), qty: 2, designExhaust: 60
    });
    expect(res.status).toBe('PASS');
    expect(res.requiredExhaust).toBe(50);
  });

  it('B. VERIFIED ASHRAE exhaust source + design exhaust < required exhaust => FAIL', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture(), qty: 2, designExhaust: 40
    });
    expect(res.status).toBe('FAIL');
    expect(res.requiredExhaust).toBe(50);
  });

  it('C. VERIFIED ASHRAE exhaust source + missing design exhaust => INCOMPLETE', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture(), qty: 2, designExhaust: null
    });
    expect(res.status).toBe('INCOMPLETE');
  });

  it('D. NOT_VERIFIED exhaust source => BLOCKED', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture({ verificationStatus: 'NOT_VERIFIED' }), qty: 2, designExhaust: 60
    });
    expect(res.status).toBe('BLOCKED');
  });

  it('E. PUBLIC_REVIEW_DRAFT exhaust source => BLOCKED', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture({ sourceType: SourceType.PUBLIC_REVIEW_DRAFT }), qty: 2, designExhaust: 60
    });
    expect(res.status).toBe('BLOCKED');
  });

  it('F. UNKNOWN exhaust source => BLOCKED', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture({ sourceType: SourceType.UNKNOWN }), qty: 2, designExhaust: 60
    });
    expect(res.status).toBe('BLOCKED');
  });

  it('G. PROJECT_SPECIFICATION => BLOCKED', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture({ sourceType: SourceType.PROJECT_SPECIFICATION }), qty: 2, designExhaust: 60
    });
    expect(res.status).toBe('BLOCKED');
  });

  it('H. ADOPTED_CODE => BLOCKED', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture({ sourceType: SourceType.ADOPTED_CODE }), qty: 2, designExhaust: 60
    });
    expect(res.status).toBe('BLOCKED');
  });

  it('I. standard mismatch => BLOCKED', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture({ standard: 'ASHRAE 62.2' }), qty: 2, designExhaust: 60
    });
    expect(res.status).toBe('BLOCKED');
  });

  it('J. edition mismatch => BLOCKED', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2022',
      exhaustType: createFixture(), qty: 2, designExhaust: 60
    });
    expect(res.status).toBe('BLOCKED');
  });

  it('K. revision mismatch => BLOCKED', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture({ revisionState: { source: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: '2019', baseEdition: '2019', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '' } }), qty: 2, designExhaust: 60
    });
    expect(res.status).toBe('BLOCKED');
  });

  it('L. missing reference => BLOCKED', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture({ reference: '' }), qty: 2, designExhaust: 60
    });
    expect(res.status).toBe('BLOCKED');
  });

  it('M. invalid/missing verificationDate for VERIFIED source => BLOCKED', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture({ verificationDate: undefined }), qty: 2, designExhaust: 60
    });
    expect(res.status).toBe('BLOCKED');
  });

  it('N. invalid quantity => FAIL', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture(), qty: -5, designExhaust: 60
    });
    expect(res.status).toBe('FAIL');
  });

  it('O. missing quantity => INCOMPLETE', () => {
    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: createFixture(), qty: null, designExhaust: 60
    });
    expect(res.status).toBe('INCOMPLETE');
  });

  describe('PRODUCTION 2025 EXHAUST SAFETY TEST', () => {
    it('calling calculate on any unverified production exhaust record MUST NOT return PASS', () => {
      let tested = 0;
      ASHRAE_621_2025_EXHAUST_RATES.forEach(record => {
        if (record.verificationStatus !== 'VERIFIED') {
          tested++;
          const res = Ashrae621ExhaustService.calculate({
            expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
            exhaustType: record as any, qty: 10, designExhaust: 100000 // Huge design exhaust should still fail
          });
          expect(res.status).toBe('BLOCKED');
          expect(res.requiredExhaust).toBeNull();
        }
      });
      expect(tested).toBeGreaterThan(0);
    });
  });

  describe('REGRESSION TEST FOR BYPASS', () => {
    it('unverified production exhaust record + valid qty + huge design exhaust MUST STILL RETURN BLOCKED', () => {
      const record = ASHRAE_621_2025_EXHAUST_RATES[0];
      expect(record.verificationStatus).not.toBe('VERIFIED');
      const res = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        exhaustType: record as any, qty: 1, designExhaust: 999999
      });
      expect(res.status).toBe('BLOCKED');
    });
  });
});
