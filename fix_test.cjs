const fs = require('fs');
const testPath = 'src/tests/ventilation/golden.test.ts';
let content = fs.readFileSync(testPath, 'utf8');

// Replace everything with a clean golden test file
content = `import { ASHRAE_622_2025_COEFFICIENTS } from '../../data/ventilation/ashrae622/2025/data';
import { Ashrae622Service } from '../../calculations/ventilation/Ashrae622Service';
import { describe, it, expect } from 'vitest';
import { UnitConversionService } from '../../services/UnitConversionService';
import { VentilationEngine } from '../../calculations/ventilation/VentilationEngine';
import { ASHRAE_621_2025_SPACE_TYPES, ASHRAE_621_2025_EZ_VALUES } from '../../data/ventilation/ashrae621/2025/data';
import { Ashrae621ExhaustService } from '../../calculations/ventilation/Ashrae621ExhaustService';
import { ASHRAE_621_2025_EXHAUST_RATES } from '../../data/ventilation/ashrae621/2025/data';

describe('Ventilation Engine Golden Tests', () => {
  it('Single-Zone: Metric and Imperial Equivalence', () => {
    const spaceType = ASHRAE_621_2025_SPACE_TYPES.find(s => s.id === 'office')!;
    const ezConfig = ASHRAE_621_2025_EZ_VALUES.find(e => e.id === 'ez_cooling_ceiling')!;
    
    // Metric Input: 100 m2, 5 people
    const metricResult = VentilationEngine.runSingleZone({
      density: { elevation: 0, temperature: 20 },
      zone: {
        spaceType,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig
      }
    });
    
    expect(metricResult.status).toBe('PASS');
    expect(metricResult.zone.vbp).toBe(2.5 * 5); // 12.5
    expect(metricResult.zone.vba).toBe(0.3 * 100); // 30
    expect(metricResult.zone.vbz).toBe(42.5);
    expect(metricResult.finalDesignOutdoorAir).toBeCloseTo(42.5, 1);

    // Imperial Input: 1076.391 ft2, 5 people
    const imperialAreaM2 = UnitConversionService.ft2ToM2(1076.39104);
    
    const imperialResult = VentilationEngine.runSingleZone({
      density: { elevation: 0, temperature: 20 },
      zone: {
        spaceType,
        area: imperialAreaM2,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig
      }
    });
    
    expect(imperialResult.status).toBe('PASS');
    expect(imperialResult.finalDesignOutdoorAir).toBeCloseTo(42.5, 1);
  });

  it('Density Correction: Hot and Elevated Condition', () => {
    const spaceType = ASHRAE_621_2025_SPACE_TYPES.find(s => s.id === 'office')!;
    const ezConfig = ASHRAE_621_2025_EZ_VALUES.find(e => e.id === 'ez_cooling_ceiling')!;
    
    const result = VentilationEngine.runSingleZone({
      density: { elevation: 1600, temperature: 35 },
      zone: {
        spaceType, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig
      }
    });
    
    expect(result.density.eRho).toBeGreaterThan(1.2);
    expect(result.finalDesignOutdoorAir).toBeGreaterThan(42.5);
    expect(result.votDensityCorrected).toBeCloseTo(result.votStandard * result.density.eRho, 4);
  });

  it('Simplified Multi-Zone Procedure D < 0.60', () => {
    const spaceType = ASHRAE_621_2025_SPACE_TYPES.find(s => s.id === 'office')!;
    const ezConfig = ASHRAE_621_2025_EZ_VALUES.find(e => e.id === 'ez_cooling_ceiling')!;
    
    const result = VentilationEngine.runMultiZone({
      method: 'Simplified',
      systemPopulation: 10,
      systemType: 'single_supply',
      density: { elevation: 0, temperature: 20 },
      zones: [
        { id: 'z1', spaceType, area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig, dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null },
        { id: 'z2', spaceType, area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig, dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null }
      ]
    });
    
    expect(result.status).toBe('PASS');
    expect(result.simplifiedSystem?.ev).toBe(0.66);
    expect(result.votStandard).toBeCloseTo(128.79, 1);
  });
  
  it('Simplified Multi-Zone Procedure D >= 0.60', () => {
    const spaceType = ASHRAE_621_2025_SPACE_TYPES.find(s => s.id === 'office')!;
    const ezConfig = ASHRAE_621_2025_EZ_VALUES.find(e => e.id === 'ez_cooling_ceiling')!;
    
    const result = VentilationEngine.runMultiZone({
      method: 'Simplified',
      systemPopulation: 15,
      systemType: 'single_supply',
      density: { elevation: 0, temperature: 20 },
      zones: [
        { id: 'z1', spaceType, area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig, dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null },
        { id: 'z2', spaceType, area: 100, designOccupancy: 10, useDefaultOccupancy: false, ezConfig, dMode: 'CV', vpz: null, vpzMinDesign: null, ep: null, er: null }
      ]
    });
    
    expect(result.simplifiedSystem?.ev).toBe(0.75);
    expect(result.votStandard).toBeCloseTo(130, 2);
  });

  it('Alternative Procedure VAV Minimum Check', () => {
    const spaceType = ASHRAE_621_2025_SPACE_TYPES.find(s => s.id === 'office')!;
    const ezConfig = ASHRAE_621_2025_EZ_VALUES.find(e => e.id === 'ez_cooling_ceiling')!;
    
    const result = VentilationEngine.runMultiZone({
      method: 'Alternative',
      systemPopulation: null,
      systemType: 'single_supply',
      density: { elevation: 0, temperature: 20 },
      zones: [
        { id: 'z1', spaceType, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig, dMode: 'VAV', vpz: 100, vpzMinDesign: 30, ep: 1, er: 0 }
      ]
    });
    
    expect(result.status).toBe('NOT_EVALUATED');
    expect(result.votStandard).toBeNull();
  });
  
  it('Simplified Procedure VAV Minimum Check', () => {
    const spaceType = ASHRAE_621_2025_SPACE_TYPES.find(s => s.id === 'office')!;
    const ezConfig = ASHRAE_621_2025_EZ_VALUES.find(e => e.id === 'ez_cooling_ceiling')!;
    
    const result = VentilationEngine.runMultiZone({
      method: 'Simplified',
      systemPopulation: 5,
      systemType: 'single_supply',
      density: { elevation: 0, temperature: 20 },
      zones: [
        { id: 'z1', spaceType, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig, dMode: 'VAV', vpz: 100, vpzMinDesign: 30, ep: null, er: null }
      ]
    });
    
    expect(result.status).toBe('FAIL');
  });

  it('Exhaust Requirements', () => {
    const type = ASHRAE_621_2025_EXHAUST_RATES.find(t => t.id === 'toilet_public')!;
    
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
      coefficients: ASHRAE_622_2025_COEFFICIENTS
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
      coefficients: ASHRAE_622_2025_COEFFICIENTS
    });
    
    expect(result.status).toBe('WARNING');
    expect(result.qFan).toBe(29); 
  });
});
`;
fs.writeFileSync(testPath, content);
