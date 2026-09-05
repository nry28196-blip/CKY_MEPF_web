import { describe, it, expect } from 'vitest';
import { Ashrae621Service } from '../../Ashrae621Service';
import { UnitConversionService } from '../../../services/UnitConversionService';

describe('Metric vs Imperial Equivalence', () => {
  it('45. Cross-Unit Golden Test: 100 m2 / 5 occupants', () => {
    // Metric
    const metricRes = Ashrae621Service.calculateZoneVentilation({
      isMetric: true,
      spaceType: { id: 'office', rpMetric: 2.5, raMetric: 0.3, rpImp: 5, raImp: 0.06 }, // 2.5 L/s-person, 0.3 L/s-m2. Imp: 5 cfm/person, 0.06 cfm/ft2
      area: 100, // m2
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: { ez: 1.0 }
    });
    
    // Imperial (100 m2 = 1076.39104 ft2)
    const impRes = Ashrae621Service.calculateZoneVentilation({
      isMetric: false,
      spaceType: { id: 'office', rpMetric: 2.5, raMetric: 0.3, rpImp: 5, raImp: 0.06 },
      area: 1076.39104,
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: { ez: 1.0 }
    });

    // Metric Voz should be 5*2.5 + 100*0.3 = 12.5 + 30 = 42.5 L/s
    expect(metricRes.voz).toBeCloseTo(42.5, 2);

    // Convert Imperial Voz to Metric
    const impVozAsMetric = UnitConversionService.cfmToLs(impRes.voz);
    
    expect(impVozAsMetric).toBeCloseTo(metricRes.voz, 1); // allow some rounding diff due to standard rp/ra tables maybe?
  });
});
