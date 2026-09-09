import { describe, it, expect } from 'vitest';
import { VentilationEngine } from '../../lib/VentilationEngine';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';


const makeVerified = (item: any) => {
    if (!item) return item;
    const ref = item.reference || 'ASHRAE 62.1 Section 6.2.2.1';
    const fakeProvenanceItem = {
        value: 1,
        standard: 'ASHRAE 62.1',
        edition: '2025',
        reference: ref,
        sourceType: 'ASHRAE_PUBLISHED',
        verificationStatus: 'VERIFIED',
        revision: '2025'
    };

    return {
      ...item,
      sourceType: 'ASHRAE_PUBLISHED',
      verificationStatus: 'VERIFIED',
      reference: ref,
      revisionState: {
        ...item.revisionState,
        standard: 'ASHRAE 62.1',
        edition: '2025',
        baseEdition: '2025',
        source: 'VERIFIED'
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

describe('ASHRAE 62.1-2025 Numerical Verification Tests', () => {

  const getSpaceType = (id: string) => makeVerified(StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === id)!);
  const getEzConfig = (id: string) => makeVerified(StandardDataProvider.get621EzValues('2025').find(e => e.id === id)!);

  describe('1. Zone Calculations (Vbz = Rp × Pz + Ra × Az)', () => {
    it('Should calculate standard Office zone precisely', () => {
      // Office: Rp = 2.5 L/s-person, Ra = 0.3 L/s-m2
      // 100 m2, 5 people -> Vbp = 12.5, Vba = 30, Vbz = 42.5 L/s
      const result = VentilationEngine.runSingleZone({
        density: { elevation: 0, temperature: 20 },
        zone: {
          expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: getSpaceType('office'),
          area: 100,
          designOccupancy: 5,
          useDefaultOccupancy: false,
          ezConfig: getEzConfig('ez-1') // Ez = 1.0 (Ceiling supply/return)
        }
      });
      
      expect(result.status).toBe('PASS');
      expect(result.zone.vbp).toBe(12.5);
      expect(result.zone.vba).toBe(30.0);
      expect(result.zone.vbz).toBe(42.5);
      expect(result.zone.voz).toBe(42.5); // Vbz / Ez = 42.5 / 1.0
      expect(result.votStandard).toBe(42.5);
    });

    it('Should calculate correctly with Ez < 1.0 (Heating, ceiling return)', () => {
      // Office: 100 m2, 5 people -> Vbz = 42.5 L/s
      // Ez = 0.8 (Heating) -> Voz = 42.5 / 0.8 = 53.125
      const result = VentilationEngine.runSingleZone({
        density: { elevation: 0, temperature: 20 },
        zone: {
          expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: getSpaceType('office'),
          area: 100,
          designOccupancy: 5,
          useDefaultOccupancy: false,
          ezConfig: getEzConfig('ez-2') // Ceiling supply warm air, ceiling return (Ez = 0.8)
        }
      });
      
      expect(result.zone.vbz).toBe(42.5);
      expect(result.zone.voz).toBe(53.125);
      expect(result.votStandard).toBe(53.125);
    });
  });

  describe('2. Density Corrections (Eρ)', () => {
    it('Should return standard conditions when at sea level and 20°C', () => {
      const result = VentilationEngine.runSingleZone({
        density: { elevation: 0, temperature: 20 }, // Standard 1.204 kg/m3 approx (0 elevation, 20C)
        zone: {
          expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: getSpaceType('office'),
          area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: getEzConfig('ez-1')
        }
      });
      // Allow minor deviation based on psychrometric formula
      expect(result.density.eRho).toBeCloseTo(1.0, 1);
      expect(result.votDensityCorrected).toBeCloseTo(42.5, 1);
    });

    it('Should inflate flow rates at high altitudes and hot temperatures', () => {
      const result = VentilationEngine.runSingleZone({
        density: { elevation: 1524, temperature: 35 }, // 5000 ft, 95F
        zone: {
          expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: getSpaceType('office'),
          area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: getEzConfig('ez-1')
        }
      });
      
      expect(result.density.eRho).toBeGreaterThan(1.2);
      expect(result.votDensityCorrected).toBeCloseTo(result.votStandard * result.density.eRho, 4);
    });
  });

  describe('3. Simplified Multizone Procedure Checks', () => {
    it('Should assign Ev = 0.66 when Diversity (D) < 0.60', () => {
      // Zone 1: Office, 100m2, 10 people -> Vbz = (10*2.5) + (100*0.3) = 25 + 30 = 55. Voz = 55
      // Zone 2: Office, 100m2, 10 people -> Vbz = 55. Voz = 55
      // Sum Voz = 110. Sum Pz = 20. 
      // Ps = 10 (System Population)
      // D = 10 / 20 = 0.50 (D < 0.60)
      
      const result = VentilationEngine.runMultiZone({
        method: 'Simplified',
        systemPopulation: 10,
        systemType: 'single_supply',
        density: { elevation: 0, temperature: 20 },
        zones: [
          { id: 'z1', expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: getSpaceType('office'), area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig: getEzConfig('ez-1'), dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null },
          { id: 'z2', expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: getSpaceType('office'), area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig: getEzConfig('ez-1'), dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null }
        ]
      });

      expect(result.status).toBe('PASS');
      expect(result.simplifiedSystem!.d).toBe(0.5);
      expect(result.simplifiedSystem!.ev).toBe(0.66); // D < 0.60
            expect(result.simplifiedSystem!.vou).toBe(85); // (10 * 2.5) + (200 * 0.3) = 25 + 60 = 85? Wait:
      // Vou = D * Sum(Rp * Pz) + Sum(Ra * Az) 
      // Vou = 0.5 * (2.5 * 20) + (0.3 * 200) = 0.5 * 50 + 60 = 25 + 60 = 85
      expect(result.simplifiedSystem!.vou).toBe(85);
      expect(result.votStandard).toBeCloseTo(85 / 0.66, 2); // Vot = Vou / Ev = 85 / 0.66 = 128.78...
    });

    it('Should assign Ev = 0.75 when Diversity (D) >= 0.60', () => {
      // Ps = 15. D = 15 / 20 = 0.75 (D >= 0.60)
      const result = VentilationEngine.runMultiZone({
        method: 'Simplified',
        systemPopulation: 15,
        systemType: 'single_supply',
        density: { elevation: 0, temperature: 20 },
        zones: [
          { id: 'z1', expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: getSpaceType('office'), area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig: getEzConfig('ez-1'), dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null },
          { id: 'z2', expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: getSpaceType('office'), area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig: getEzConfig('ez-1'), dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null }
        ]
      });

      expect(result.simplifiedSystem!.d).toBe(0.75);
      expect(result.simplifiedSystem!.ev).toBe(0.75); // D >= 0.60
      // Vou = D * Sum(Rp * Pz) + Sum(Ra * Az) = 0.75 * 50 + 60 = 37.5 + 60 = 97.5
      expect(result.simplifiedSystem!.vou).toBe(97.5);
      expect(result.votStandard).toBeCloseTo(97.5 / 0.75, 2); // 130
    });
  });
});
