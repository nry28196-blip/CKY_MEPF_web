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
      edition: '2022',
      localExhaustDeficit: 0
    });
    // 0.15 * 100 + 3.5 * 3 = 15 + 10.5 = 25.5
    expect(res.qTot).toBeCloseTo(25.5);
  });

  it('should calculate infiltration credit properly', () => {
    const res = Ashrae622Service.calculateVentilation({
      floorArea: 100,
      bedrooms: 2,
      isMetric: true,
      qInf: 10,
      phi: 0.5,
      edition: '2022',
      localExhaustDeficit: 0
    });
    // Qtot = 25.5
    // credit = 10 * 0.5 = 5
    // qFan = 20.5
    expect(res.qFan).toBeCloseTo(20.5);
  });

  it('should trigger WARNING for 2025 infiltration credit', () => {
    const res = Ashrae622Service.calculateVentilation({
      floorArea: 100,
      bedrooms: 2,
      isMetric: true,
      qInf: 10,
      phi: 0.5,
      edition: '2025',
      localExhaustDeficit: 0
    });
    expect(res.status).toBe('WARNING');
    expect(res.warning).toContain('2025 infiltration credit requires strict verification');
  });

  it('should add local exhaust deficit to whole-dwelling rate', () => {
    const res = Ashrae622Service.calculateVentilation({
      floorArea: 100,
      bedrooms: 2,
      isMetric: true,
      qInf: 0,
      phi: 1.0,
      edition: '2022',
      localExhaustDeficit: 15
    });
    // Qtot = 25.5
    // Qfan = 25.5 + 15 = 40.5
    expect(res.qFan).toBeCloseTo(40.5);
  });
});
