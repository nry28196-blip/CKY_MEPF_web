import { describe, it, expect } from 'vitest';
import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';
import { Ashrae621SimplifiedSystemService } from '../../calculations/ventilation/Ashrae621SimplifiedSystemService';
import { Ashrae621AlternativeSystemService } from '../../calculations/ventilation/Ashrae621AlternativeSystemService';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';
import { SourceType, Ashrae621SpaceType, Ashrae621Ez } from '../../data/ventilation/ashrae621/types';
import { DataProvenanceValidationService } from '../../calculations/ventilation/DataProvenanceValidationService';

const syntheticSpaceType: Ashrae621SpaceType = {
  id: 'synthetic-office',
  name: 'Synthetic Office',
  standard: 'ASHRAE 62.1',
  edition: '2022',
  category: 'Office',
  rpMetric: 2.5,
  raMetric: 0.3,
  defaultOccupancyMetric: 5,
  units: 'L/s-person, L/s-m2',
  exhaustRequired: false,
  reference: 'Table 6.2.2.1',
  notes: 'Synthetic',
  sourceType: SourceType.ASHRAE_PUBLISHED,
  verificationStatus: 'VERIFIED',
  verificationDate: '2024-01-01',
  revisionState: {
    standard: 'ASHRAE 62.1',
    edition: '2022',
    baseEdition: '2022',
    publishedAddendaApplied: ['Addendum j'],
    publishedErrataApplied: [],
    source: SourceType.ASHRAE_PUBLISHED,
    verificationDate: '2024-01-01'
  }
};

const syntheticEz: Ashrae621Ez = {
  id: 'synthetic-ez',
  name: 'Synthetic Ez',
  ez: 0.8,
  reference: 'Table 6-4',
  standard: 'ASHRAE 62.1',
  edition: '2022',
  configuration: 'Ceiling Supply / Ceiling Return',
  applicableCondition: 'Cooling',
  supplyArrangement: 'Ceiling',
  returnArrangement: 'Ceiling',
  sourceType: SourceType.ASHRAE_PUBLISHED,
  verificationStatus: 'VERIFIED',
  verificationDate: '2024-01-01',
  revisionState: {
    standard: 'ASHRAE 62.1',
    edition: '2022',
    baseEdition: '2022',
    publishedAddendaApplied: ['Addendum j'],
    publishedErrataApplied: [],
    source: SourceType.ASHRAE_PUBLISHED,
    verificationDate: '2024-01-01'
  }
};

describe('ASHRAE 62.1-2022 Addendum j Eρ Propagation (Calculation-Isolation)', () => {
  const eRho = 1.3;

  it('TEST A - Single Zone Eρ Placement (Equation 6-2)', () => {
    // Equation 6-2: Voz = (Vbz/Ez) * Eρ
    const pz = 10;
    const az = 100;
    
    const zoneResult = Ashrae621ZoneService.calculateZone({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      area: az,
      designOccupancy: pz,
      useDefaultOccupancy: false,
      spaceType: syntheticSpaceType,
      ezConfig: syntheticEz,
      eRho
    });
    
    // Independently calculated expected values based on synthetic data
    const Rp = 2.5; // syntheticSpaceType.rpMetric
    const Ra = 0.3; // syntheticSpaceType.raMetric
    const Ez = 0.8; // syntheticEz.ez
    
    const vbz = (Rp * pz) + (Ra * az); // 25 + 30 = 55
    const expectedVoz = (vbz / Ez) * eRho; // (55 / 0.8) * 1.3 = 89.375
     
    expect(zoneResult.voz).toBeCloseTo(expectedVoz);
    expect(zoneResult.auditTrail.find(a => a.symbol === 'Voz')?.formula).toContain('Eρ');
  });

  it('TEST B - Simplified Multi-Zone Vou (Must NOT multiply by Eρ)', () => {
    const result = Ashrae621SimplifiedSystemService.calculate({
      ps: 80,
      zones: [
        { id: '1', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100, vpz: null, vpzMinDesign: null, dMode: 'CV' },
        { id: '2', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100, vpz: null, vpzMinDesign: null, dMode: 'CV' }
      ]
    });
    const expectedVou = (0.8 * 100 + 150); 
    expect(result.vou).toBeCloseTo(expectedVou);
  });

  it('TEST C - Alternative Multi-Zone Vou (Must NOT multiply by Eρ)', () => {
    const result = Ashrae621AlternativeSystemService.calculate({
      ps: 80,
      systemType: 'single_supply',
      zones: [
        { id: '1', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100, vpz: 1000, vpzMinDesign: 500, vpzMinRequired: 500, dMode: 'CV', er: 0, ez: 1.0 },
        { id: '2', pz: 50, rp: 1, ra: 1.5, az: 50, voz: 100, vpz: 1000, vpzMinDesign: 500, vpzMinRequired: 500, dMode: 'CV', er: 0, ez: 1.0 }
      ]
    });
    const expectedVou = (0.8 * 100 + 150); 
    expect(result.vou).toBeCloseTo(expectedVou);
  });

  it('TEST D - Alternative VAV Zd Density Consistency', () => {
    const vozStandard = 100;
    const vozActual = vozStandard * eRho; 
    const vdzActual = 500;
    
    const result = Ashrae621AlternativeSystemService.calculate({
      ps: 80,
      systemType: 'secondary_recirculation',
      zones: [
        { id: '1', pz: 50, rp: 1, ra: 1.5, az: 50, voz: vozActual, vpz: 1000, vpzMinDesign: vdzActual, vpzMinRequired: vdzActual, vdzMinDesign: vdzActual, dMode: 'VAV', er: 0.5, ez: 1.0 },
        { id: '2', pz: 30, rp: 1, ra: 1.5, az: 50, voz: vozActual, vpz: 1000, vpzMinDesign: vdzActual, vpzMinRequired: vdzActual, vdzMinDesign: vdzActual, dMode: 'VAV', er: 0.5, ez: 1.0 }
      ]
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

describe('Production Provenance Tests', () => {
  it('should accurately report the verification status of 2022 production data without fabricating metadata', () => {
    const spaceTypes = StandardDataProvider.get621SpaceTypes('2022');
    
    // Test that every VERIFIED space type passes the validator
    let hasInvalidVerifiedStatus = false;
    spaceTypes.forEach(space => {
      if (space.verificationStatus === 'VERIFIED') {
        const validationResult = DataProvenanceValidationService.validateSpaceTypeData(space, 'ASHRAE 62.1', '2022', false);
        if (validationResult.status !== 'PASS') {
          hasInvalidVerifiedStatus = true;
          console.error(`Invalid Space Type: ${space.id}`, validationResult.reasons);
        }
      }
    });
    
    // Explicit assertion that every verified record passes
    expect(hasInvalidVerifiedStatus).toBe(false);

    // Let's also do Ez and Exhaust
    const ezValues = StandardDataProvider.get621EzValues('2022');
    ezValues.forEach(ez => {
      if (ez.verificationStatus === 'VERIFIED') {
        const validationResult = DataProvenanceValidationService.validateEzData(ez, 'ASHRAE 62.1', '2022');
        if (validationResult.status !== 'PASS') {
          hasInvalidVerifiedStatus = true;
          console.error(`Invalid Ez: ${ez.id}`, validationResult.reasons);
        }
      }
    });
    expect(hasInvalidVerifiedStatus).toBe(false);

    const exhaustRates = StandardDataProvider.get621ExhaustRates('2022');
    exhaustRates.forEach(exh => {
      if (exh.verificationStatus === 'VERIFIED') {
        const validationResult = DataProvenanceValidationService.validateExhaustData(exh, 'ASHRAE 62.1', '2022');
        if (validationResult.status !== 'PASS') {
          hasInvalidVerifiedStatus = true;
          console.error(`Invalid Exhaust: ${exh.id}`, validationResult.reasons);
        }
      }
    });
    expect(hasInvalidVerifiedStatus).toBe(false);
  });
});

import { DensityCorrectionService } from '../../lib/DensityCorrectionService';

describe('Analytical Eρ and Table 6-5 Verification', () => {
  it('TEST F - Table 6-5 Boundary Verification', () => {
    expect(DensityCorrectionService.getTableERho(0)).toBe(1.00);
    expect(DensityCorrectionService.getTableERho(158)).toBe(1.00);
    expect(DensityCorrectionService.getTableERho(159)).toBe(1.05);
    expect(DensityCorrectionService.getTableERho(566)).toBe(1.05);
    expect(DensityCorrectionService.getTableERho(567)).toBe(1.10);
    expect(DensityCorrectionService.getTableERho(951)).toBe(1.10);
    expect(DensityCorrectionService.getTableERho(952)).toBe(1.15);
    expect(DensityCorrectionService.getTableERho(1317)).toBe(1.15);
    expect(DensityCorrectionService.getTableERho(3437)).toBe(1.50);
    expect(DensityCorrectionService.getTableERho(3438)).toBeNull(); // Appendix D fallback
  });

  it('TEST G - Analytical Eρ Standard Condition (Independent)', () => {
    // A: Near standard conditions (0m, 21C, 0% RH)
    // p = 101.3 kPa
    // T = 21C = 294.15K
    // pd = 101.3 kPa
    // dry air density = 101.3 / (0.287058 * 294.15) = 1.200
    // eRho = 1.2 / 1.200 = 1.000
    const res = DensityCorrectionService.calculate({ elevation: 0, temperature: 21, relativeHumidity: 0, method: 'ANALYTICAL' });
    expect(res.eRho).toBeCloseTo(1.0, 3);
  });

  it('TEST H - Analytical Eρ Elevated Condition (Independent)', () => {
    // B: Elevated outdoor-air intake (1500m, 21C, 0% RH)
    // Z = 1500
    // p = 101.3 * (1 - 2.25577e-5 * 1500)^5.2559 = 84.556 kPa
    // pd = 84.556 kPa
    // dry air density = 84.556 / (0.287058 * 294.15) = 1.0014
    // eRho = 1.2 / 1.0014 = 1.1983
    
    // Let's do the independent math
    const z = 1500;
    const pAtm = 101.3 * Math.pow(1 - 2.25577e-5 * z, 5.2559);
    const expectedDensity = pAtm / (0.287058 * 294.15);
    const expectedERho = 1.2 / expectedDensity;
    
    const res = DensityCorrectionService.calculate({ elevation: 1500, temperature: 21, relativeHumidity: 0, method: 'ANALYTICAL' });
    expect(res.eRho).toBeCloseTo(expectedERho, 4);
  });

  it('TEST I - Analytical Eρ Realistic Warm Condition (Independent)', () => {
    // C: Realistic warm condition (0m, 35C, 50% RH)
    // T = 35C = 308.15K
    // psat at 35C = 0.61078 * exp(17.27 * 35 / (35 + 237.3)) = 5.6268 kPa
    // pv = 0.50 * 5.6268 = 2.8134 kPa
    // pAtm = 101.3 kPa
    // pd = 101.3 - 2.8134 = 98.4866 kPa
    // dry air density = 98.4866 / (0.287058 * 308.15) = 1.1134 kg/m3
    // eRho = 1.2 / 1.1134 = 1.0778
    
    const psat = 0.61078 * Math.exp((17.27 * 35) / (35 + 237.3));
    const pv = 0.5 * psat;
    const pd = 101.3 - pv;
    const expectedDensity = pd / (0.287058 * 308.15);
    const expectedERho = 1.2 / expectedDensity;
    
    const res = DensityCorrectionService.calculate({ elevation: 0, temperature: 35, relativeHumidity: 50, method: 'ANALYTICAL' });
    expect(res.eRho).toBeCloseTo(expectedERho, 4);
  });

  it('TEST J - Analytical Eρ Realistic Cool Condition (Independent)', () => {
    // D: Realistic cool condition (0m, 0C, 50% RH)
    // T = 0C = 273.15K
    // psat at 0C = 0.61078 * exp(17.27 * 0 / (0 + 237.3)) = 0.61078 kPa
    // pv = 0.50 * 0.61078 = 0.30539 kPa
    // pAtm = 101.3 kPa
    // pd = 101.3 - 0.30539 = 100.9946 kPa
    // dry air density = 100.9946 / (0.287058 * 273.15) = 1.288
    // eRho = 1.2 / 1.288 = 0.931
    
    const psat = 0.61078 * Math.exp((17.27 * 0) / (0 + 237.3));
    const pv = 0.5 * psat;
    const pd = 101.3 - pv;
    const expectedDensity = pd / (0.287058 * 273.15);
    const expectedERho = 1.2 / expectedDensity;
    
    const res = DensityCorrectionService.calculate({ elevation: 0, temperature: 0, relativeHumidity: 50, method: 'ANALYTICAL' });
    expect(res.eRho).toBeCloseTo(expectedERho, 4);
  });
});
