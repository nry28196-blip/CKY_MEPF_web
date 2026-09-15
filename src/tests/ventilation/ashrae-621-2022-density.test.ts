import { describe, it, expect } from 'vitest';
import { VentilationEngine } from '../../lib/VentilationEngine';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';

const makeVerified = (item: any) => {
    if (!item) return item;
    const ref = item.reference || 'ASHRAE 62.1 Section 6.2.2.1';
    const fakeProvenanceItem = {
        value: 1,
        standard: 'ASHRAE 62.1',
        edition: '2022',
        reference: ref,
        sourceType: 'ASHRAE_PUBLISHED',
        verificationStatus: 'VERIFIED',
        verificationDate: '2022-01-01',
        revision: '2022'
    };
    return {
      ...item,
      sourceType: 'ASHRAE_PUBLISHED',
      verificationStatus: 'VERIFIED',
      verificationDate: '2022-01-01',
      reference: ref,
      revisionState: {
        ...item.revisionState,
        standard: 'ASHRAE 62.1',
        edition: '2022',
        baseEdition: '2022',
        source: 'ASHRAE_PUBLISHED',
        publishedAddendaApplied: ['Addendum j']
      },
      provenance: item.category ? {
          rp: { ...fakeProvenanceItem, value: item.rpMetric },
          ra: { ...fakeProvenanceItem, value: item.raMetric },
          defaultOccupancy: { ...fakeProvenanceItem, value: item.defaultOccupancyMetric },
          reference: { ...fakeProvenanceItem, value: ref }
      } : {
          ez: { ...fakeProvenanceItem, value: item.ez },
          applicability: { ...fakeProvenanceItem, value: item.applicableCondition },
          reference: { ...fakeProvenanceItem, value: ref }
      }
    };
};

describe('ASHRAE 62.1-2022 Density Correction (Addendum j)', () => {
  const getSpaceType = (id: string) => makeVerified(StandardDataProvider.get621SpaceTypes('2022').find(s => s.id === id)!);
  const getEzConfig = (id: string) => makeVerified(StandardDataProvider.get621EzValues('2022').find(e => e.id === id)!);

  it('Should apply Addendum j density correction equation (Eρ = ρ_standard / ρ_actual) in 2022 edition', () => {
    const result = VentilationEngine.runSingleZone({
      edition: '2022',
      density: { elevation: 1524, temperature: 35 }, // 5000 ft, 95F
      zone: {
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2022',
        spaceType: getSpaceType('office'),
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: getEzConfig('ez-1')
      }
    });

    // ρ_standard = 1.204
    // At 1524m, 35C: P ~ 84.5 kPa, T = 308.15 K
    // ρ_actual = 84.5 / (0.287058 * 308.15) = 84.5 / 88.456 = 0.955 kg/m3
    // eRho = 1.204 / 0.955 = 1.26
    
    expect(result.density.eRho).toBeGreaterThan(1.2);
    expect(result.density.eRho).toBeLessThan(1.3);
    
    // Vot_standard = 42.5
    // Vot_actual = 42.5 * 1.26 = 53.5
    expect(result.votDensityCorrected).toBeGreaterThan(50);
  });
});
