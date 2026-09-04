import { describe, it, expect } from 'vitest';
import { Ashrae621Service } from '../Ashrae621Service';

describe('Ashrae621Service (Metric/Imperial Equivalence)', () => {
  it('should calculate identical zone Voz in Metric and Imperial for a basic office', () => {
    // Metric Input: 100 m2 office, 5 people
    const metricInput = {
      spaceType: { rpMetric: 2.5, raMetric: 0.3, rpImperial: 5, raImperial: 0.06 }, // Office: 2.5 L/s-p, 0.3 L/s-m2 | 5 cfm/p, 0.06 cfm/ft2
      area: 100, // 100 m2
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: { ez: 1.0 },
      isMetric: true
    };
    
    // Imperial Input: 100 / 0.092903 sqft, 5 people
    const imperialInput = {
      spaceType: { rpMetric: 2.5, raMetric: 0.3, rpImperial: 5, raImperial: 0.06 },
      area: 100 / 0.092903, // ~1076.39 sqft
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: { ez: 1.0 },
      isMetric: false
    };

    const metricResult = Ashrae621Service.calculateZoneVentilation(metricInput);
    const imperialResult = Ashrae621Service.calculateZoneVentilation(imperialInput);

    // Vbz = Rp * Pz + Ra * Az
    // Metric: 2.5 * 5 + 0.3 * 100 = 12.5 + 30 = 42.5 L/s
    expect(metricResult.voz).toBeCloseTo(42.5, 1);

    // Convert imperial Voz (cfm) back to metric (L/s) to compare equivalence
    // 42.5 L/s * 2.11888 = 90.05 cfm. Let's just convert the output directly.
    const cfmToLs = (cfm: number) => cfm * 0.471947;
    expect(cfmToLs(imperialResult.voz)).toBeCloseTo(metricResult.voz, 1);
  });
});
