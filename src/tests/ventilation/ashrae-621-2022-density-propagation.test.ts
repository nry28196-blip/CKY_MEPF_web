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
    
    const actualRp = zoneResult.rp!;
    const actualRa = zoneResult.ra!;
    const vbz = actualRp * pz + actualRa * az;
    const actualEz = zoneResult.ez!;
    const expectedVoz = (vbz / actualEz) * eRho; 
    
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
    const validator = new DataProvenanceValidationService();
    
    let hasInvalidVerifiedStatus = false;

    spaceTypes.forEach(space => {
      // Check if it claims to be verified
      if (space.verificationStatus === 'VERIFIED') {
        const validationResult = DataProvenanceValidationService.validateSpaceTypeData(space, 'ASHRAE 62.1', '2022', false);
        if (validationResult.status !== 'PASS') {
          hasInvalidVerifiedStatus = true;
        }
      }
    });

    // If the production data is missing root verification dates but claims VERIFIED, it's invalid
    expect(hasInvalidVerifiedStatus).toBe(true);
  });
});
