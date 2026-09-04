import { describe, it, expect } from 'vitest';
import { Ashrae621SimplifiedSystemService } from '../Ashrae621SimplifiedSystemService';

describe('Ashrae621SimplifiedSystemService', () => {
  const dummyZone = {
    zoneResult: { az: 100, pz: 5, rp: 2.5, ra: 0.3, vbp: 12.5, vba: 30, vbz: 42.5, ez: 1.0, voz: 42.5, occupancyUsed: 5, occupancySource: 'design', status: 'PASS' } as any,
    vpz: 100,
    vpzMin: 80
  };

  it('10. D < 0.60', () => {
    const res = Ashrae621SimplifiedSystemService.calculate({
      zones: [dummyZone],
      systemPopulation: 2 // D = 2/5 = 0.4 < 0.6
    });
    // Ev = 0.88 * 0.4 + 0.22 = 0.572
    expect(res.ev).toBeCloseTo(0.572, 3);
  });

  it('11. D >= 0.60', () => {
    const res = Ashrae621SimplifiedSystemService.calculate({
      zones: [dummyZone],
      systemPopulation: 4 // D = 4/5 = 0.8
    });
    expect(res.ev).toBeCloseTo(0.75, 2);
  });

  it('14. Missing Vpz-min', () => {
    const res = Ashrae621SimplifiedSystemService.calculate({
      zones: [{ ...dummyZone, vpzMin: undefined }],
      systemPopulation: 5
    });
    // Missing vpzMin -> WARNING
    expect(res.status).toBe('WARNING');
    expect(res.warning).toContain('missing Vpz-min');
  });

  it('15. Vpz-min insufficient', () => {
    const res = Ashrae621SimplifiedSystemService.calculate({
      zones: [{ ...dummyZone, vpzMin: 10 }], // required = 1.5 * 42.5 = 63.75
      systemPopulation: 5
    });
    expect(res.status).toBe('FAIL');
    expect(res.error).toContain('less than required');
  });

  it('16. Ps > ΣPz', () => {
    const res = Ashrae621SimplifiedSystemService.calculate({
      zones: [dummyZone],
      systemPopulation: 10 // > 5
    });
    expect(res.status).toBe('FAIL');
  });

  it('17. Missing Ps', () => {
    const res = Ashrae621SimplifiedSystemService.calculate({
      zones: [dummyZone]
    });
    // Missing Ps -> INCOMPLETE
    expect(res.status).toBe('INCOMPLETE');
    expect(res.d).toBe(1.0);
  });
});
