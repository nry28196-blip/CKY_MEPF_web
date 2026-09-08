import { describe, it, expect } from 'vitest';
import { VentilationEngine } from '../../lib/VentilationEngine';
import { UnitConversionService, ft2ToM2 } from "../../lib/UnitConversionService";
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';

describe('ASHRAE 62.1 Office Ventilation Golden Tests', () => {
  
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


  const officeSpaceType = StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === 'office')!;
  const verifiedOffice = makeVerified(officeSpaceType);
  const ezConfig = StandardDataProvider.get621EzValues('2025').find(e => e.id === 'ez-1')!;
  const verifiedEz = makeVerified(ezConfig);

  it('Test A - Office Metric', () => {
    const result = VentilationEngine.runSingleZone({
      zone: {
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: 100, // m2
        designOccupancy: 5, // persons
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      },
      density: { elevation: 0, temperature: 20 }
    });

    expect(result.status).toBe('PASS');
    expect(result.zone.vbp).toBeCloseTo(12.5, 2); // 5 * 2.5
    expect(result.zone.vba).toBeCloseTo(30, 2); // 100 * 0.3
    expect(result.zone.vbz).toBeCloseTo(42.5, 2);
    expect(result.zone.voz).toBeCloseTo(42.5, 2); // ez = 1
    expect(result.votStandard).toBeCloseTo(42.5, 2);
    expect(result.finalDesignOutdoorAir).toBeCloseTo(42.5, 2);
  });

  it('Test B - Office Imperial Equivalence', () => {
    const areaM2 = ft2ToM2(1076.391);
    const result = VentilationEngine.runSingleZone({
      zone: {
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: areaM2,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      },
      density: { elevation: 0, temperature: 20 }
    });

    expect(result.status).toBe('PASS');
    expect(result.zone.vbp).toBeCloseTo(12.5, 2); // 5 * 2.5
    expect(result.zone.vba).toBeCloseTo(100 * 0.3, 2); // 100 * 0.3 = 30
    expect(result.zone.vbz).toBeCloseTo(42.5, 2);
    expect(result.zone.voz).toBeCloseTo(42.5, 2);
    expect(result.votStandard).toBeCloseTo(42.5, 2);
    expect(result.finalDesignOutdoorAir).toBeCloseTo(42.5, 2);
  });

  it('Test C - Office Ez', () => {
    const ezHeating = StandardDataProvider.get621EzValues('2025').find(e => e.id === 'ez-2')!; // Ez = 0.8
    const result = VentilationEngine.runSingleZone({
      zone: {
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: makeVerified(ezHeating)
      },
      density: { elevation: 0, temperature: 20 }
    });

    expect(result.status).toBe('PASS');
    expect(result.zone.vbz).toBeCloseTo(42.5, 2);
    expect(result.zone.voz).toBeCloseTo(42.5 / 0.8, 2); // 53.125
  });

  it('Test D - Office default occupancy', () => {
    const result = VentilationEngine.runSingleZone({
      zone: {
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: 100,
        designOccupancy: null,
        useDefaultOccupancy: true,
        ezConfig: verifiedEz
      },
      density: { elevation: 0, temperature: 20 }
    });

    expect(result.status).toBe('PASS'); // Standard default used
    expect(result.zone.pz).toBeCloseTo(5.4, 2); // default is 5.4 per 100m2
    expect(result.zone.vbp).toBeCloseTo(5.4 * 2.5, 2); // 13.5
    expect(result.zone.vba).toBeCloseTo(30, 2);
    expect(result.zone.vbz).toBeCloseTo(43.5, 2);
  });

  it('Test F - Simplified Multizone', () => {
    const result = VentilationEngine.runMultiZone({
      zones: [
        {
          id: 'zone-1', expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice, area: 100, designOccupancy: 5,
          useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'CV', vpz: 100, vpzMinDesign: null, ep: null, er: null
        },
        {
          id: 'zone-2', expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice, area: 100, designOccupancy: 5,
          useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'CV', vpz: 100, vpzMinDesign: null, ep: null, er: null
        }
      ],
      density: { elevation: 0, temperature: 20 },
      method: 'Simplified',
      systemPopulation: 8, // Ps = 8, sumPz = 10 -> D = 0.8
      systemType: 'single_supply'
    });

    expect(result.status).toBe('PASS');
    expect(result.simplifiedSystem).toBeDefined();
    expect(result.simplifiedSystem!.d).toBeCloseTo(0.8, 2);
    // When D >= 0.60, Ev = 0.75
    expect(result.simplifiedSystem!.ev).toBeCloseTo(0.75, 2);
    
    // Vou = D * sumRpPz + sumRaAz
    // sumRpPz = 2.5 * 10 = 25
    // sumRaAz = 0.3 * 200 = 60
    // Vou = 0.8 * 25 + 60 = 20 + 60 = 80
    expect(result.simplifiedSystem!.vou).toBeCloseTo(80, 2);
    expect(result.votStandard).toBeCloseTo(80 / 0.75, 2); // 106.67
  });

  it('Test G - VAV', () => {
    const result = VentilationEngine.runMultiZone({
      zones: [
        {
          id: 'zone-1', expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice, area: 100, designOccupancy: 5,
          useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'VAV', vpz: 100, vpzMinDesign: 65, ep: null, er: null
        }
      ],
      density: { elevation: 0, temperature: 20 },
      method: 'Simplified',
      systemPopulation: 5, // D = 1.0
      systemType: 'single_supply'
    });

    // Voz = 42.5
    // Simplified VAV vpzMinRequired = 1.5 * Voz = 63.75
    // vpzMinDesign = 65 >= 63.75 -> PASS
    expect(result.status).toBe('PASS');
  });

  it('Test H - Missing Vpz-min', () => {
    const result = VentilationEngine.runMultiZone({
      zones: [
        {
          id: 'zone-1', expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice, area: 100, designOccupancy: 5,
          useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'VAV', vpz: 100, vpzMinDesign: null, ep: null, er: null
        }
      ],
      density: { elevation: 0, temperature: 20 },
      method: 'Simplified',
      systemPopulation: 5,
      systemType: 'single_supply'
    });

    expect(result.status).toBe('INCOMPLETE');
  });

  it('Test L - Missing density input', () => {
    const result = VentilationEngine.runSingleZone({
      zone: {
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: 100, // m2
        designOccupancy: 5, // persons
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      },
      density: { elevation: NaN, temperature: NaN } // Missing
    });

    expect(result.status).toBe('INCOMPLETE');
    expect(result.votDensityCorrected).toBeNull();
  });

  it('Test M - Alternative Procedure', () => {
    const result = VentilationEngine.runMultiZone({
      zones: [
        {
          id: 'zone-1', expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice, area: 100, designOccupancy: 5,
          useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'CV', vpz: 100, vpzMinDesign: null, ep: null, er: null
        }
      ],
      density: { elevation: 0, temperature: 20 },
      method: 'Alternative',
      systemPopulation: 5,
      systemType: 'single_supply'
    });

    expect(result.status).toBe('PASS');
    expect(result.alternativeSystem!.ev).not.toBeNull();
    expect(result.votStandard).not.toBeNull();
  });

  it('Test I - Invalid Ev', () => {
    // We can simulate invalid Ev by providing a scenario where Ev <= 0.
    // In Simplified, Ev = 0.88 * D + 0.22 (if D < 0.6) or 0.75. D = Ps / SumPz.
    // Ps cannot be negative, so D >= 0, Ev is at least 0.22. 
    // We can test this by mocking or passing a negative Ps (which gets rejected as INCOMPLETE, but if forced).
    // Actually, we can just check if Ev=0 causes FAIL in the engine.
    const result = VentilationEngine.runMultiZone({
      zones: [
        {
          id: 'zone-1', expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice, area: 100, designOccupancy: 5,
          useDefaultOccupancy: false, ezConfig: verifiedEz, dMode: 'CV', vpz: 100, vpzMinDesign: null, ep: null, er: null
        }
      ],
      density: { elevation: 0, temperature: 20 },
      method: 'Simplified',
      systemPopulation: -5, // Negative Ps
      systemType: 'single_supply'
    });

    expect(result.status).toBe('FAIL');
    expect(result.votStandard).toBeNull();
  });

  it('Test N - Invalid Ez', () => {
    const result = VentilationEngine.runSingleZone({
      zone: {
        expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2025',
      spaceType: verifiedOffice,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: { ...verifiedEz, ez: 0 } // Invalid Ez
      },
      density: { elevation: 0, temperature: 20 }
    });

    expect(result.status).toBe('FAIL');
    expect(result.zone.voz).toBeNull();
  });
});
