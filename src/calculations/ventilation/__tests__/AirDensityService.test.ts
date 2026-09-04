import { describe, it, expect } from 'vitest';
import { AirDensityService } from '../../services/AirDensityService';

describe('AirDensityService', () => {
  it('should calculate air properties correctly at sea level', () => {
    const props = AirDensityService.getAirProperties(0, 20, 0); // Sea level, 20C, 0% RH
    expect(props.densityRatio).toBeCloseTo(1.0, 3);
  });

  it('should calculate Erho > 1 at elevated altitude', () => {
    const props = AirDensityService.getAirProperties(1500, 20, 0); // 1500m
    expect(props.densityRatio).toBeGreaterThan(1.0);
  });

  it('should apply density correction correctly (Vot_act = Vot_std * Erho)', () => {
    // Erho = 1.204 / 1.0 = 1.204
    // Standard flow = 1000. Actual = 1000 * 1.204 = 1204
    const res = AirDensityService.applyDensityCorrection(1000, 1.204);
    expect(res).toBeCloseTo(1204, 1);
  });
});
