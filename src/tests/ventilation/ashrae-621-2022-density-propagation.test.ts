import { describe, it, expect } from 'vitest';
import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';
import { Ashrae621SimplifiedSystemService } from '../../calculations/ventilation/Ashrae621SimplifiedSystemService';
import { Ashrae621AlternativeSystemService } from '../../calculations/ventilation/Ashrae621AlternativeSystemService';
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

describe('ASHRAE 62.1-2022 Addendum j Eρ Propagation', () => {
  const eRho = 1.3;

  it('TEST A - Single Zone Eρ Placement (Equation 6-2)', () => {
    // Equation 6-2: Voz = (Vbz/Ez) * Eρ
    const pz = 10;
    const az = 100;
    const ez = 0.8;
    
    const zoneResult = Ashrae621ZoneService.calculateZone({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      area: az,
      designOccupancy: pz,
      useDefaultOccupancy: false,
      spaceType: makeVerified(StandardDataProvider.get621SpaceTypes('2022').find(s => s.id === 'office')!),
      ezConfig: makeVerified(StandardDataProvider.get621EzValues('2022').find(e => e.id === 'ez-1')!),
      eRho
    });
    
    const actualRp = zoneResult.rp!;
    const actualRa = zoneResult.ra!;
    const vbz = actualRp * pz + actualRa * az;
    const actualEz = zoneResult.ez!;
    const expectedVoz = (vbz / actualEz) * eRho; 
    
    expect(zoneResult.voz).toBeCloseTo(expectedVoz);
    expect(zoneResult.auditTrail.find(a => a.symbol === 'Voz')?.formula).toContain('Eρ');
  });

  it('TEST B - Simplified Multi-Zone Vou (Must NOT multiply by Eρ)', () => {
    // Addendum j does not modify Vou. Eρ belongs at the zone level only for 62.1.
    // Vou = D * Sum(Rp*Pz) + Sum(Ra*Az)
    const result = Ashrae621SimplifiedSystemService.calculate({
      ps: 80,
      zones: [
        { id: '1', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100, vpz: null, vpzMinDesign: null, dMode: 'CV' },
        { id: '2', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100, vpz: null, vpzMinDesign: null, dMode: 'CV' }
      ]
    });
    const expectedVou = (0.8 * 100 + 150); // No Eρ multiplier!
    expect(result.vou).toBeCloseTo(expectedVou);
  });

  it('TEST C - Alternative Multi-Zone Vou (Must NOT multiply by Eρ)', () => {
    // Vou = D * Sum(Rp*Pz) + Sum(Ra*Az)
    const result = Ashrae621AlternativeSystemService.calculate({
      ps: 80,
      systemType: 'single_supply',
      zones: [
        { id: '1', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100, vpz: 1000, vpzMinDesign: 500, vpzMinRequired: 500, dMode: 'CV', er: 0, ez: 1.0 },
        { id: '2', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100, vpz: 1000, vpzMinDesign: 500, vpzMinRequired: 500, dMode: 'CV', er: 0, ez: 1.0 }
      ]
    });
    const expectedVou = (0.8 * 100 + 150); // No Eρ multiplier!
    expect(result.vou).toBeCloseTo(expectedVou);
  });

  it('TEST D - Alternative VAV Zd Density Consistency', () => {
    const vozStandard = 100;
    const vozActual = vozStandard * eRho; // Zone calculates actual
    const vdzActual = 500;
    
    const result = Ashrae621AlternativeSystemService.calculate({
      ps: 80,
      systemType: 'secondary_recirculation',
      zones: [
        { id: '1', pz: 50, rp: 1, ra: 1.5, az: 50, voz: vozActual, vpz: 1000, vpzMinDesign: vdzActual, vpzMinRequired: vdzActual, vdzMinDesign: vdzActual, dMode: 'VAV', er: 0.5, ez: 1.0 },
        { id: '2', pz: 30, rp: 1, ra: 1.5, az: 50, voz: vozActual, vpz: 1000, vpzMinDesign: vdzActual, vpzMinRequired: vdzActual, vdzMinDesign: vdzActual, dMode: 'VAV', er: 0.5, ez: 1.0 }
      ]
    });
    
    // Zd = Voz / Vdz
    const expectedZd = vozActual / vdzActual;
    const zoneZd = result.zoneResults.find(z => z.id === '1')!.zd;
    expect(zoneZd).toBeCloseTo(expectedZd);
  });

  it('TEST E - No Double Correction in Vot', () => {
    const result = Ashrae621SimplifiedSystemService.calculate({
      ps: 80,
      zones: [
        { id: '1', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 130, vpz: null, vpzMinDesign: null, dMode: 'CV' },
        { id: '2', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 130, vpz: null, vpzMinDesign: null, dMode: 'CV' }
      ]
    });
    
    const expectedVou = 230; 
    const expectedEv = 0.75;
    const expectedVot = expectedVou / expectedEv;
    
    expect(result.vou).toBeCloseTo(expectedVou);
    expect(result.ev).toBeCloseTo(expectedEv);
    
    const vot = result.vou / result.ev;
    expect(vot).toBeCloseTo(expectedVot);
  });
});
