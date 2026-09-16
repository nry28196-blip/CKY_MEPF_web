import { describe, it, expect } from 'vitest';
import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';
import { Ashrae621SimplifiedSystemService } from '../../calculations/ventilation/Ashrae621SimplifiedSystemService';
import { Ashrae621AlternativeSystemService } from '../../calculations/ventilation/Ashrae621AlternativeSystemService';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';

describe('ASHRAE 62.1-2022 Addendum j Eρ Propagation', () => {
  const eRho = 1.3;

  it('TEST A - Single Zone Eρ Placement', () => {
    const pz = 10;
    const az = 100;
    const ez = 0.8;
    
    const zoneResult = Ashrae621ZoneService.calculateZone({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      area: az,
      designOccupancy: pz,
      useDefaultOccupancy: false,
      spaceType: StandardDataProvider.get621SpaceTypes('2022').find(s => s.id === 'office')!,
      ezConfig: StandardDataProvider.get621EzValues('2022').find(e => e.id === 'ez-1')!,
      eRho
    });
    
    const actualRp = zoneResult.rp;
    const actualRa = zoneResult.ra;
    const expectedVoz = ((actualRp * pz + actualRa * az) / ez) * eRho; 
    expect(zoneResult.voz).toBeCloseTo(expectedVoz);
  });

  it('TEST B - Simplified Multi-Zone Eρ Placement', () => {
    const result = Ashrae621SimplifiedSystemService.calculate({
      ps: 80,
      zones: [
        { id: '1', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100, vpz: null, vpzMinDesign: null, dMode: 'CV' },
        { id: '2', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100, vpz: null, vpzMinDesign: null, dMode: 'CV' }
      ],
      eRho
    });
    const expectedVou = (0.8 * 100 + 150) * eRho; 
    expect(result.vou).toBeCloseTo(expectedVou);
  });

  it('TEST C - Alternative Multi-Zone Eρ Placement', () => {
    const result = Ashrae621AlternativeSystemService.calculate({
      ps: 80,
      systemType: 'single_supply',
      zones: [
        { id: '1', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100 * eRho, vpz: 1000, vpzMinDesign: 500, vpzMinRequired: 500, dMode: 'CV', er: 0, ez: 1.0 },
        { id: '2', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100 * eRho, vpz: 1000, vpzMinDesign: 500, vpzMinRequired: 500, dMode: 'CV', er: 0, ez: 1.0 }
      ],
      eRho
    });
    const expectedVou = (0.8 * 100 + 150) * eRho; 
    expect(result.vou).toBeCloseTo(expectedVou);
  });

  it('TEST D - Alternative VAV Zd Density Consistency', () => {
    const vozStandard = 100;
    const vozActual = vozStandard * eRho;
    const vdzActual = 500;
    
    const result = Ashrae621AlternativeSystemService.calculate({
      ps: 80,
      systemType: 'single_supply',
      zones: [
        { id: '1', pz: 50, rp: 1, ra: 1.5, az: 50, voz: vozActual, vpz: 1000, vpzMinDesign: vdzActual, vpzMinRequired: vdzActual, dMode: 'VAV', er: 0, ez: 1.0 },
        { id: '2', pz: 30, rp: 1, ra: 1.5, az: 50, voz: vozActual, vpz: 1000, vpzMinDesign: vdzActual, vpzMinRequired: vdzActual, dMode: 'VAV', er: 0, ez: 1.0 }
      ],
      eRho
    });
    
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
      ],
      eRho
    });
    
    const expectedVou = 299; 
    const expectedEv = 0.75;
    const expectedVot = expectedVou / expectedEv;
    
    expect(result.vou).toBeCloseTo(expectedVou);
    expect(result.ev).toBeCloseTo(expectedEv);
    
    const vot = result.vou / result.ev;
    expect(vot).toBeCloseTo(expectedVot);
  });
});
