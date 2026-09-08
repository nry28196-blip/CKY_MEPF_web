import { describe, it, expect } from 'vitest';
import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';

describe('ASHRAE 62.1 Zone Service - Vbz and Voz', () => {
  
  const officeSpace = StandardDataProvider.get621SpaceTypes('2025').find(s => s.name === 'Office space')!;

const makeVerified = (item) => {
  if (!item) return item;
  return {
    ...item,
    sourceType: 'ASHRAE_PUBLISHED',
    reference: item.reference || 'ASHRAE 62.1 Section 6.2.2.1',
    revisionState: {
      ...item.revisionState,
      standard: 'ASHRAE 62.1',
      edition: '2025',
      baseEdition: '2025',
      source: 'VERIFIED'
    }
  };
};

const verifiedOffice = makeVerified(officeSpace);


  const ezCeiling = StandardDataProvider.get621EzValues('2025').find(e => e.name === 'Ceiling Supply / Ceiling Return (Cooling)')!;
  const verifiedEz = makeVerified(ezCeiling);

  it('1. OFFICE GOLDEN TEST — DESIGN OCCUPANCY (BASIC)', () => {
    const result = Ashrae621ZoneService.calculateZone({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
      area: 100,
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: verifiedEz
    });

    expect(result.status).toBe('PASS');
    expect(result.az).toBe(100);
    expect(result.pz).toBe(5);
    expect(result.occupancySource).toBe('design');
    
    // Vbp = Rp * Pz = 2.5 * 5 = 12.5
    expect(result.vbp).toBeCloseTo(12.5, 4);
    
    // Vba = Ra * Az = 0.3 * 100 = 30
    expect(result.vba).toBeCloseTo(30, 4);
    
    // Vbz = Vbp + Vba = 12.5 + 30 = 42.5
    expect(result.vbz).toBeCloseTo(42.5, 4);
    
    // Voz = Vbz / Ez = 42.5 / 1.0 = 42.5
    expect(result.ez).toBe(1.0);
    expect(result.voz).toBeCloseTo(42.5, 4);
  });

  it('2. OFFICE GOLDEN TEST — DEFAULT OCCUPANCY', () => {
    const result = Ashrae621ZoneService.calculateZone({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
      area: 100,
      designOccupancy: null,
      useDefaultOccupancy: true,
      ezConfig: verifiedEz
    });

    expect(result.status).toBe('PASS');
    expect(result.az).toBe(100);
    expect(result.occupancySource).toBe('default');
    
    // Default density for office is 5.4 persons / 100 m²
    // Pz = 5.4 * 100 / 100 = 5.4
    expect(result.pz).toBeCloseTo(5.4, 4);
    
    // Vbp = Rp * Pz = 2.5 * 5.4 = 13.5
    expect(result.vbp).toBeCloseTo(13.5, 4);
    
    // Vba = 0.3 * 100 = 30
    expect(result.vba).toBeCloseTo(30, 4);
    
    // Vbz = 13.5 + 30 = 43.5
    expect(result.vbz).toBeCloseTo(43.5, 4);
    
    // Voz = Vbz / Ez = 43.5 / 1.0 = 43.5
    expect(result.voz).toBeCloseTo(43.5, 4);
  });

  describe('3. INVALID INPUT TESTS', () => {
    it('Missing space type -> INCOMPLETE', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: null,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('INCOMPLETE');
      expect(result.vbz).toBeNull();
    });

    it('Missing Ez -> INCOMPLETE', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: null
      });
      expect(result.status).toBe('INCOMPLETE');
      expect(result.voz).toBeNull();
    });

    it('Area = 0 -> FAIL', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: 0,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('FAIL');
      expect(result.vbz).toBeNull();
    });

    it('Area < 0 -> FAIL', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: -10,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('FAIL');
      expect(result.vbz).toBeNull();
    });

    it('Occupancy missing -> INCOMPLETE', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: 100,
        designOccupancy: null,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('INCOMPLETE');
      expect(result.vbz).toBeNull();
    });

    it('Occupancy < 0 -> FAIL', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: 100,
        designOccupancy: -5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('FAIL');
      expect(result.vbz).toBeNull();
    });

    it('Ez <= 0 -> FAIL', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: { ...ezCeiling, ez: 0 }
      });
      expect(result.status).toBe('FAIL');
      expect(result.voz).toBeNull();
    });

    it('Rp unavailable -> INCOMPLETE', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: { ...verifiedOffice, rpMetric: NaN },
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('INCOMPLETE');
      expect(result.vbz).toBeNull();
    });
    
    it('Ra unavailable -> INCOMPLETE', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: { ...verifiedOffice, raMetric: NaN },
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('INCOMPLETE');
      expect(result.vbz).toBeNull();
    });
  });
});
