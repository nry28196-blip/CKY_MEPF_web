
import { Ashrae622Service } from '../../calculations/ventilation/Ashrae622Service';
import { describe, it, expect } from 'vitest';
import { UnitConversionService, ft2ToM2 } from "../../lib/UnitConversionService";
import { VentilationEngine } from '../../lib/VentilationEngine';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';
import { Ashrae621ExhaustService } from '../../calculations/ventilation/Ashrae621ExhaustService';



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
        verificationDate: '2025-01-01',
        revision: '2025'
    };

    return {
      ...item,
      sourceType: 'ASHRAE_PUBLISHED',
      verificationStatus: 'VERIFIED',
        verificationDate: '2025-01-01',
      reference: ref,
      revisionState: {
        ...item.revisionState,
        standard: 'ASHRAE 62.1',
        edition: '2025',
        baseEdition: '2025',
        source: 'ASHRAE_PUBLISHED'
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

describe('Ventilation Engine Golden Tests', () => {
  it('Single-Zone: Metric and Imperial Equivalence', () => {
    const spaceType = StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === 'office')!;
    const verifiedSpaceType = makeVerified(spaceType);
    const ezConfig = StandardDataProvider.get621EzValues('2025').find(e => e.id === 'ez-1')!;
    const verifiedEz = makeVerified(ezConfig);
    
    // Metric Input: 100 m2, 5 people
    const metricResult = VentilationEngine.runSingleZone({
      density: { elevation: 0, temperature: 20 },
      zone: {
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: verifiedSpaceType, area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      }
    });
    
    expect(metricResult.status).toBe('PASS');
    expect(metricResult.zone.vbp).toBe(2.5 * 5); // 12.5
    expect(metricResult.zone.vba).toBe(0.3 * 100); // 30
    expect(metricResult.zone.vbz).toBe(42.5);
    expect(metricResult.finalDesignOutdoorAir).toBeCloseTo(42.5, 1);

    // Imperial Input: 1076.391 ft2, 5 people
    const imperialAreaM2 = ft2ToM2(1076.39104);
    
    const imperialResult = VentilationEngine.runSingleZone({
      density: { elevation: 0, temperature: 20 },
      zone: {
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: verifiedSpaceType, area: imperialAreaM2,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      }
    });
    
    expect(imperialResult.status).toBe('PASS');
    expect(imperialResult.finalDesignOutdoorAir).toBeCloseTo(42.5, 1);
  });

  it('Density Correction: Hot and Elevated Condition', () => {
    const spaceType = StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === 'office')!;
    const verifiedSpaceType = makeVerified(spaceType);
    const ezConfig = StandardDataProvider.get621EzValues('2025').find(e => e.id === 'ez-1')!;
    const verifiedEz = makeVerified(ezConfig);
    
    const result = VentilationEngine.runSingleZone({
      density: { elevation: 1600, temperature: 35 },
      zone: {
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: verifiedSpaceType, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      }
    });
    
    expect(result.density.eRho).toBeGreaterThan(1.2);
    expect(result.finalDesignOutdoorAir).toBeGreaterThan(42.5);
    expect(result.votDensityCorrected).toBeCloseTo(result.votStandard * result.density.eRho, 4);
  });

  it('Simplified Multi-Zone Procedure D < 0.60', () => {
    const spaceType = StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === 'office')!;
    const verifiedSpaceType = makeVerified(spaceType);
    const ezConfig = StandardDataProvider.get621EzValues('2025').find(e => e.id === 'ez-1')!;
    const verifiedEz = makeVerified(ezConfig);
    
    const result = VentilationEngine.runMultiZone({
      method: 'Simplified',
      systemPopulation: 10,
      systemType: 'single_supply',
      density: { elevation: 0, temperature: 20 },
      zones: [
        { expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', id: 'z1', spaceType: verifiedSpaceType, area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null },
        { expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', id: 'z2', spaceType: verifiedSpaceType, area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null }
      ]
    });
    
    expect(result.status).toBe('PASS');
    expect(result.simplifiedSystem?.ev).toBe(0.66);
    expect(result.votStandard).toBeCloseTo(128.79, 1);
  });
  
  it('Simplified Multi-Zone Procedure D >= 0.60', () => {
    const spaceType = StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === 'office')!;
    const verifiedSpaceType = makeVerified(spaceType);
    const ezConfig = StandardDataProvider.get621EzValues('2025').find(e => e.id === 'ez-1')!;
    const verifiedEz = makeVerified(ezConfig);
    
    const result = VentilationEngine.runMultiZone({
      method: 'Simplified',
      systemPopulation: 15,
      systemType: 'single_supply',
      density: { elevation: 0, temperature: 20 },
      zones: [
        { expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', id: 'z1', spaceType: verifiedSpaceType, area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null },
        { expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', id: 'z2', spaceType: verifiedSpaceType, area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null }
      ]
    });
    
    expect(result.simplifiedSystem?.ev).toBe(0.75);
    expect(result.votStandard).toBeCloseTo(130, 2);
  });

  it('Alternative Procedure VAV Minimum Check', () => {
    const spaceType = StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === 'office')!;
    const verifiedSpaceType = makeVerified(spaceType);
    const ezConfig = StandardDataProvider.get621EzValues('2025').find(e => e.id === 'ez-1')!;
    const verifiedEz = makeVerified(ezConfig);
    
    const result = VentilationEngine.runMultiZone({
      method: 'Alternative',
      systemPopulation: null,
      systemType: 'single_supply',
      density: { elevation: 0, temperature: 20 },
      zones: [
        { expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', id: 'z1', spaceType: verifiedSpaceType, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'VAV', vpz: 100, vpzMinDesign: 30, ep: 1, er: 0 }
      ]
    });
    
    expect(result.status).toBe('FAIL');
    expect(result.votStandard).toBeNull();
  });
  
  it('Simplified Procedure VAV Minimum Check', () => {
    const spaceType = StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === 'office')!;
    const verifiedSpaceType = makeVerified(spaceType);
    const ezConfig = StandardDataProvider.get621EzValues('2025').find(e => e.id === 'ez-1')!;
    const verifiedEz = makeVerified(ezConfig);
    
    const result = VentilationEngine.runMultiZone({
      method: 'Simplified',
      systemPopulation: 5,
      systemType: 'single_supply',
      density: { elevation: 0, temperature: 20 },
      zones: [
        { expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', id: 'z1', spaceType: verifiedSpaceType, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'VAV', vpz: 100, vpzMinDesign: 30, ep: null, er: null }
      ]
    });
    
    expect(result.status).toBe('FAIL');
  });

  it('Exhaust Requirements', () => {
    const type = StandardDataProvider.get621ExhaustRates('2025').find(t => t.id === 'toilet_public')!;
    
    const result = Ashrae621ExhaustService.calculate({
      exhaustType: type,
      qty: 4,
      designExhaust: 100
    });
    
    expect(result.requiredExhaust).toBe(100);
    expect(result.status).toBe('PASS');
    
    const failResult = Ashrae621ExhaustService.calculate({
      exhaustType: type,
      qty: 4,
      designExhaust: 80
    });
    expect(failResult.status).toBe('FAIL');
  });
});

describe('ASHRAE 62.2 Engine Golden Tests', () => {
  it('Whole Dwelling - SI Calculation', () => {
    const result = Ashrae622Service.calculateWholeDwelling({
      floorArea: 100,
      bedrooms: 3,
      infiltrationCredit: 0,
      infiltrationVerified: false,
      localExhaust: null,
      coefficients: StandardDataProvider.get622Coefficients('2025')
    });
    
    expect(result.qTot).toBe(29);
    expect(result.qFan).toBe(29);
    expect(result.status).toBe('PASS');
  });

  it('Infiltration Credit Warning', () => {
    const result = Ashrae622Service.calculateWholeDwelling({
      floorArea: 100,
      bedrooms: 3,
      infiltrationCredit: 10,
      infiltrationVerified: false,
      localExhaust: null,
      coefficients: StandardDataProvider.get622Coefficients('2025')
    });
    
    expect(result.status).toBe('WARNING');
    expect(result.qFan).toBe(29); 
  });
});
