import { describe, it, expect } from 'vitest';
import { Ashrae621ZoneService } from '../Ashrae621ZoneService';

describe('Ashrae621ZoneService', () => {
  const dummySpace = {
    rpMetric: 2.5,
    raMetric: 0.3,
    defaultOccupancyMetric: 5
  };

  it('1. Metric office calculation', () => {
    const res = Ashrae621ZoneService.calculateZoneVentilation({
      spaceType: dummySpace,
      area: 100, // 100 m2
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: { ez: 1.0 }
    });
    // pz = 5. rp = 2.5 => vbp = 12.5
    // az = 100. ra = 0.3 => vba = 30
    // vbz = 42.5. ez = 1.0 => voz = 42.5
    expect(res.pz).toBe(5);
    expect(res.vbp).toBe(12.5);
    expect(res.vba).toBe(30);
    expect(res.vbz).toBe(42.5);
    expect(res.voz).toBe(42.5);
    expect(res.status).toBe('PASS');
  });

  it('4. Default occupancy calculation', () => {
    const res = Ashrae621ZoneService.calculateZoneVentilation({
      spaceType: dummySpace,
      area: 100,
      designOccupancy: 0,
      useDefaultOccupancy: true,
      ezConfig: { ez: 1.0 }
    });
    // default density = 5 per 100m2 => pz = 5
    expect(res.pz).toBe(5);
    expect(res.vbp).toBe(12.5);
    expect(res.occupancySource).toBe('default');
  });

  it('6. Different Ez', () => {
    const res = Ashrae621ZoneService.calculateZoneVentilation({
      spaceType: dummySpace,
      area: 100,
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: { ez: 0.8 }
    });
    expect(res.voz).toBeCloseTo(42.5 / 0.8);
  });

  it('7. Invalid area', () => {
    const res = Ashrae621ZoneService.calculateZoneVentilation({
      spaceType: dummySpace,
      area: -10,
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: { ez: 1.0 }
    });
    expect(res.status).toBe('FAIL');
  });

  it('8. Invalid occupancy', () => {
    const res = Ashrae621ZoneService.calculateZoneVentilation({
      spaceType: dummySpace,
      area: 100,
      designOccupancy: -5,
      useDefaultOccupancy: false,
      ezConfig: { ez: 1.0 }
    });
    expect(res.status).toBe('FAIL');
  });

  it('9. Invalid Ez', () => {
    const res = Ashrae621ZoneService.calculateZoneVentilation({
      spaceType: dummySpace,
      area: 100,
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: { ez: -1.0 }
    });
    expect(res.status).toBe('FAIL');
  });
});
