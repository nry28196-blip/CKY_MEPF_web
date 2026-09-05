import { describe, it, expect } from 'vitest';
import { MultiZoneVentilationService } from '../../MultiZoneVentilationService';

describe('VAV missing vpzMin', () => {
  it('14. Missing Vpz-min in simplified multizone', () => {
    const res = MultiZoneVentilationService.calculateMultiZoneSystem(
      {
        isVAV: true,
        zones: [
          {
            input: { primaryAirflow: 100, vpzMin: '' },
            result: { pz: 5, rp: 2.5, ra: 0.3, az: 100, voz: 42.5 }
          }
        ]
      },
      null, null, 1.0, 'simplified'
    );
    expect(res.status).toBe('INCOMPLETE');
  });

  it('Missing Vpz-min in alternative multizone', () => {
    const res = MultiZoneVentilationService.calculateMultiZoneSystem(
      {
        isVAV: true,
        zones: [
          {
            input: { primaryAirflow: 100, vpzMin: undefined, ep: 1, er: 0 },
            result: { pz: 5, rp: 2.5, ra: 0.3, az: 100, voz: 42.5 }
          }
        ]
      },
      null, 100, 1.0, 'alternative'
    );
    expect(res.status).toBe('INCOMPLETE');
  });
  
  it('CV converts Vpz-min to Vpz automatically', () => {
    const res = MultiZoneVentilationService.calculateMultiZoneSystem(
      {
        isVAV: false,
        zones: [
          {
            input: { primaryAirflow: 100, vpzMin: '', ep: 1, er: 0 },
            result: { pz: 5, rp: 2.5, ra: 0.3, az: 100, voz: 42.5, ez: 1 }
          }
        ]
      },
      null, 100, 1.0, 'alternative'
    );
    // Should pass, because it will set vpzMin to 100.
    // wait, alternative needs ps, so it will warn about ps, but not fail on vpzMin
    expect(res.status).not.toBe('FAIL');
    expect(res.status).not.toBe('INCOMPLETE'); // PS assumption triggers WARNING but not INCOMPLETE
  });
});
