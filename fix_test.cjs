const fs = require('fs');

const content = `import { describe, it, expect } from 'vitest';
import { MultiZoneVentilationService, MultiZoneInput } from '../MultiZoneVentilationService';

describe('MultiZoneVentilationService', () => {
  it('should calculate proper occupant diversity and uncorrected outdoor air (Vou)', () => {
    const zones: MultiZoneInput[] = [
      {
        zoneId: 'zone-1',
        name: 'Conference Room',
        zoneResult: {
          az: 1000,
          pz: 50,
          rp: 5,
          ra: 0.06,
          vbp: 250, // 5 cfm * 50
          vba: 60,  // 0.06 cfm * 1000
          vbz: 310,
          ez: 1.0,
          voz: 310,
          occupancyUsed: 50,
          occupancySource: 'default'
        },
        primaryAirflow: 1000,
        vpzMin: 500
      },
      {
        zoneId: 'zone-2',
        name: 'Office',
        zoneResult: {
          az: 2000,
          pz: 10,
          rp: 5,
          ra: 0.06,
          vbp: 50,  // 5 cfm * 10
          vba: 120, // 0.06 cfm * 2000
          vbz: 170,
          ez: 1.0,
          voz: 170,
          occupancyUsed: 10,
          occupancySource: 'default'
        },
        primaryAirflow: 1200,
        vpzMin: 300
      }
    ];

    const result = MultiZoneVentilationService.calculateMultiZoneSystem(
      zones,
      45, // systemPopulation
      null, // vpsInput
      1.0 // densityRatio
    );

    expect(result.sumPz).toBe(60);
    expect(result.ps).toBe(45);
    expect(result.d).toBe(0.75);
    expect(result.vou).toBe(405);
    expect(result.vps).toBe(500 + 300); // 800
  });

  it('should calculate exact System Ventilation Efficiency (Ev) with diverse Vpz-min', () => {
    const zones: MultiZoneInput[] = [
      {
        zoneId: 'zone-1',
        name: 'Conference Room',
        zoneResult: { az: 1000, pz: 50, rp: 5, ra: 0.06, vbp: 250, vba: 60, vbz: 310, ez: 1.0, voz: 310, occupancyUsed: 50, occupancySource: 'default' },
        primaryAirflow: 1000,
        vpzMin: 500,
        ep: 1.0,
        er: 0.0
      },
      {
        zoneId: 'zone-2',
        name: 'Office',
        zoneResult: { az: 2000, pz: 10, rp: 5, ra: 0.06, vbp: 50, vba: 120, vbz: 170, ez: 1.0, voz: 170, occupancyUsed: 10, occupancySource: 'default' },
        primaryAirflow: 1200,
        vpzMin: 300,
        ep: 1.0,
        er: 0.0
      }
    ];

    const result = MultiZoneVentilationService.calculateMultiZoneSystem(zones, 45);
    const expectedZpz1 = 310 / 500; // 0.62
    const expectedZpz2 = 170 / 300; // 0.5666...
    const xs = 405 / 800; // 0.50625
    const expectedEvz1 = 1 + xs - expectedZpz1; 
    const expectedEvz2 = 1 + xs - expectedZpz2; 
    
    expect(result.xs).toBeCloseTo(xs);
    expect(result.zdMax).toBeCloseTo(expectedZpz1);
    expect(result.criticalZoneId).toBe('zone-1');

    const ev = Math.min(expectedEvz1, expectedEvz2); // 0.88625
    expect(result.ev).toBeCloseTo(ev);
    expect(result.vot).toBeCloseTo(405 / ev);
  });

  it('should default to primaryAirflow if vpzMin is not provided', () => {
    const zones: MultiZoneInput[] = [
      {
        zoneId: 'z1',
        name: 'Z1',
        zoneResult: { az: 100, pz: 5, rp: 5, ra: 0.06, vbp: 25, vba: 6, vbz: 31, ez: 1.0, voz: 31, occupancyUsed: 5, occupancySource: 'default' },
        primaryAirflow: 200
      }
    ];

    const result = MultiZoneVentilationService.calculateMultiZoneSystem(zones);
    expect(result.sumVpzMin).toBe(200);
    expect(result.vps).toBe(200);
    expect(result.zones[0].zpz).toBe(31 / 200);
  });
});
`
fs.writeFileSync('src/calculations/ventilation/__tests__/MultiZoneVentilationService.test.ts', content);
