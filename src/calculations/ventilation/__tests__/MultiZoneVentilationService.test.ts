import { describe, it, expect } from 'vitest';
import { MultiZoneVentilationService } from '../MultiZoneVentilationService';
import { AirDensityService } from '../../services/AirDensityService';

describe('MultiZoneVentilationService', () => {
  it('calculates alternative multi-zone system correctly', () => {
    const inputs = {
      zones: [
        {
          zoneResult: { az: 100, pz: 50, rp: 2.5, ra: 0.3, vbz: 155, ez: 1.0, voz: 155 },
          input: { primaryAirflow: 200, vpzMin: 50 }
        }
      ]
    };
    
    const result = MultiZoneVentilationService.calculateMultiZoneSystem(
      inputs, null, 200, 1.0, 'alternative'
    );
    
    expect(result.vou).toBe(155);
    expect(result.vot).toBeGreaterThan(0);
    expect(result.method).toBe('alternative');
  });

  it('calculates simplified multi-zone system correctly', () => {
    const inputs = {
      zones: [
        {
          zoneResult: { az: 100, pz: 50, rp: 2.5, ra: 0.3, vbz: 155, ez: 1.0, voz: 155 },
          input: { primaryAirflow: 200 }
        }
      ]
    };
    
    const result = MultiZoneVentilationService.calculateMultiZoneSystem(
      inputs, null, null, 1.0, 'simplified'
    );
    
    expect(result.vou).toBe(155);
    expect(result.method).toBe('simplified');
  });
});
