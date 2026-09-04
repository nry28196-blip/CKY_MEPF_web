import { describe, it, expect } from 'vitest';
import { Ashrae621AlternativeSystemService } from '../Ashrae621AlternativeSystemService';

describe('Ashrae621AlternativeSystemService', () => {
  const dummyZone = {
    zoneResult: { az: 100, pz: 5, rp: 2.5, ra: 0.3, vbp: 12.5, vba: 30, vbz: 42.5, ez: 1.0, voz: 42.5, occupancyUsed: 5, occupancySource: 'design', status: 'PASS' } as any,
    vpz: 200,
    vpzMin: 100,
    ep: 1.0,
    er: 0.0
  };

  it('18. Single-supply (Alternative)', () => {
    const res = Ashrae621AlternativeSystemService.calculate({
      zones: [dummyZone],
      systemPopulation: 5,
      vps: 200
    });
    expect(res.status).toBe('PASS');
    expect(res.ev).toBeGreaterThan(0);
  });

  it('19. Missing Vpz-min', () => {
    const res = Ashrae621AlternativeSystemService.calculate({
      zones: [{ ...dummyZone, vpzMin: undefined as any }],
      systemPopulation: 5,
      vps: 200
    });
    expect(res.status).toBe('INCOMPLETE');
  });

  it('20. Missing Vps', () => {
    const res = Ashrae621AlternativeSystemService.calculate({
      zones: [dummyZone],
      systemPopulation: 5
    });
    // Missing Vps defaults to warning and uses sum of vpz
    expect(res.status).toBe('INCOMPLETE');
    expect(res.vps).toBe(200);
  });

  it('22. Zpz > 1', () => {
    const res = Ashrae621AlternativeSystemService.calculate({
      zones: [{ ...dummyZone, vpzMin: 10 }], // Voz = 42.5, Zpz = 4.25
      systemPopulation: 5,
      vps: 200
    });
    expect(res.status).toBe('FAIL');
    expect(res.error).toContain('Zpz');
  });
});
