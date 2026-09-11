import { describe, it, expect } from 'vitest';
import { Ashrae621ExhaustService } from '../../calculations/ventilation/Ashrae621ExhaustService';
import { Ashrae621ExhaustType } from '../../data/ventilation/ashrae621/types';

describe('ASHRAE 62.1-2025 Exhaust Space Calculations', () => {
  it('Should correctly compute Art Classrooms rate per Unit', () => {
    const exhaustType: Ashrae621ExhaustType = {
      id: 'art-class',
      category: 'Educational',
      standard: 'ASHRAE 62.1',
      rate: 3.5, 
      unitType: 'm2', 
      exhaustClass: 2,
      name: 'Test',
      operatingCondition: 'continuous',
      reference: 'Table 6.5',
      edition: '2025',
      revisionState: { standard: 'ASHRAE 62.1', edition: '2025', baseEdition: '2025', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '', source: 'UNKNOWN' }, sourceType: 'PUBLIC_REVIEW_DRAFT',
      verificationStatus: 'NOT_VERIFIED'
    };

    const result = Ashrae621ExhaustService.calculate({
      exhaustType,
      qty: 100, 
      designExhaust: 350
    });

    expect(result.status).toBe('PASS');
    expect(result.requiredExhaust).toBeCloseTo(350, 1);
  });

  it('Should correctly compute Public Restrooms rate per Unit', () => {
    const exhaustType: Ashrae621ExhaustType = {
      id: 'restroom-public',
      category: 'General',
      standard: 'ASHRAE 62.1',
      rate: 25, 
      unitType: 'fixture',
      exhaustClass: 2,
      name: 'Test',
      operatingCondition: 'continuous',
      reference: 'Table 6.5',
      edition: '2025',
      revisionState: { standard: 'ASHRAE 62.1', edition: '2025', baseEdition: '2025', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '', source: 'UNKNOWN' }, sourceType: 'PUBLIC_REVIEW_DRAFT',
      verificationStatus: 'NOT_VERIFIED'
    };

    const result = Ashrae621ExhaustService.calculate({
      exhaustType,
      qty: 4, 
      designExhaust: 100
    });

    expect(result.status).toBe('PASS');
    expect(result.requiredExhaust).toBeCloseTo(100, 1);
  });

  it('Should return INCOMPLETE when exhaustType is null', () => {
    const result = Ashrae621ExhaustService.calculate({
      exhaustType: null,
      qty: 1,
      designExhaust: 100
    });

    expect(result.status).toBe('NOT_EVALUATED');
    expect(result.requiredExhaust).toBe(0);
  });

  it('Should throw FAIL if qty is invalid', () => {
    const exhaustType: Ashrae621ExhaustType = {
      id: 'art-class',
      category: 'Educational',
      standard: 'ASHRAE 62.1',
      rate: 3.5,
      unitType: 'm2',
      exhaustClass: 2,
      name: 'Test',
      operatingCondition: 'continuous',
      reference: 'Table 6.5',
      edition: '2025',
      revisionState: { standard: 'ASHRAE 62.1', edition: '2025', baseEdition: '2025', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '', source: 'UNKNOWN' }, sourceType: 'PUBLIC_REVIEW_DRAFT',
      verificationStatus: 'NOT_VERIFIED'
    };

    const result = Ashrae621ExhaustService.calculate({
      exhaustType,
      qty: -10, // Invalid
      designExhaust: 350
    });

    expect(result.status).toBe('FAIL');
  });
});