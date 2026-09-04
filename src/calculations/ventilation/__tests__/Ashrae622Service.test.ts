import { describe, it, expect } from 'vitest';
import { Ashrae622Service } from '../Ashrae622Service';

describe('Ashrae622Service', () => {
  it('should calculate Qtot correctly for metric', () => {
    const res = Ashrae622Service.calculateVentilation({
      floorArea: 100,
      bedrooms: 2,
      isMetric: true,
      qInf: 0,
      phi: 1.0,
      edition: '2022'
    });
    // 0.15 * 100 + 3.5 * 3 = 15 + 10.5 = 25.5
    expect(res.qTot).toBeCloseTo(25.5);
  });
});
