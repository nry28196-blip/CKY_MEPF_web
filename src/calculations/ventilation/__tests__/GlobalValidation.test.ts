import { describe, it, expect } from 'vitest';
import { Ashrae621SimplifiedSystemService } from '../Ashrae621SimplifiedSystemService';

describe('Global Validation Hierarchy', () => {
  const goodZone = {
    zoneResult: { az: 100, pz: 5, rp: 2.5, ra: 0.3, vbp: 12.5, vba: 30, vbz: 42.5, ez: 1.0, voz: 42.5, occupancyUsed: 5, occupancySource: 'design', status: 'PASS' } as any,
    vpz: 100,
    vpzMin: 80
  };
  const failZone = {
    zoneResult: { az: 100, pz: 5, rp: 2.5, ra: 0.3, vbp: 12.5, vba: 30, vbz: 42.5, ez: 1.0, voz: 42.5, occupancyUsed: 5, occupancySource: 'design', status: 'PASS' } as any,
    vpz: 100,
    vpzMin: 10 // required is 63.75, so this will fail the zone
  };

  it('39. Global System State Hierarchy (FAIL > WARNING)', () => {
    // If one zone is failing, but system is missing Ps (which normally causes WARNING)
    // The FAIL should bubble up and override WARNING.
    const res = Ashrae621SimplifiedSystemService.calculate({
      zones: [failZone], // Fail
      systemPopulation: undefined // normally WARNING
    });
    expect(res.status).toBe('FAIL');
  });

  it('40. Zone Vpz-min failing immediately bubbles up and fails multizone', () => {
    const res = Ashrae621SimplifiedSystemService.calculate({
      zones: [goodZone, failZone],
      systemPopulation: 10 
    });
    expect(res.status).toBe('FAIL');
  });

  it('41. Ensure false-zero is not masking unentered value', () => {
    const res = Ashrae621SimplifiedSystemService.calculate({
      zones: [{ ...goodZone, vpzMin: undefined as any }],
      systemPopulation: 5
    });
    // undefined should trigger warning, not be evaluated as 0
    expect(res.status).toBe('WARNING');
  });
});
