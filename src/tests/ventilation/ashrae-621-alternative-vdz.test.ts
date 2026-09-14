import { describe, it, expect } from 'vitest';
import { Ashrae621AlternativeSystemService, AlternativeZoneInput } from '../../calculations/ventilation/Ashrae621AlternativeSystemService';
import { Ashrae621SimplifiedSystemService } from '../../calculations/ventilation/Ashrae621SimplifiedSystemService';
import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';

describe('ASHRAE 62.1-2025 Alternative Procedure Vdz/Zd INDEPENDENT MATHEMATICAL TESTS', () => {

  const createBaseZone = (id: string, overrides: Partial<AlternativeZoneInput> = {}): AlternativeZoneInput => ({
    id,
    pz: 10,
    rp: 2.5,
    ra: 0.3,
    az: 100,
    voz: 60,
    vpz: 100,
    vpzMinRequired: 60,
    vpzMinDesign: 80,
    ep: null,
    er: null,
    ez: 1.0,
    dMode: 'VAV',
    ...overrides
  });

  it('CASE 1 — Single-supply: Vpz = Vdz, Ep and Zd are correct', () => {
    const input = {
      zones: [createBaseZone('Z1', { voz: 40, vpzMinDesign: 80 })],
      ps: 10,
      systemType: 'single_supply' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('PASS');
    const z = result.zoneResults[0];
    expect(z.ep).toBe(1.0); // Single supply has Ep = 1.0
    expect(z.vdzMin).toBe(z.vpzMin); // Vdz = Vpz
    expect(z.zd).toBeCloseTo(40 / 80); // Voz / VdzMin
  });

  it('CASE 2 — Secondary recirculation: Vpz < Vdz, Ep correctly used', () => {
    const input = {
      zones: [createBaseZone('Z1', { voz: 40, vpzMinDesign: 40, ep: 0.5, er: 0.5 })],
      ps: 10,
      systemType: 'secondary_recirculation' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('PASS');
    const z = result.zoneResults[0];
    expect(z.ep).toBe(0.5);
    expect(z.vdzMin).toBeCloseTo(80); // 40 / 0.5
    expect(z.zd).toBeCloseTo(40 / 80);
  });

  it('CASE 3 — VAV minimum discharge airflow used as design condition', () => {
    const input = {
      zones: [createBaseZone('Z1', { dMode: 'VAV', voz: 20, vpzMinDesign: 40, ep: 0.8, er: 0.2 })],
      ps: 10,
      systemType: 'secondary_recirculation' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('PASS');
    const z = result.zoneResults[0];
    expect(z.vpzMin).toBe(40); // The VAV minimum primary
    expect(z.vdzMin).toBe(40 / 0.8); // 50
    expect(z.zd).toBe(20 / 50); // evaluated at minimum discharge airflow
  });

  it('CASE 4 — Invalid airflow (Starvation Zd > 1.0) fails calculation', () => {
    // If voz is 100, but vpzMin is 40 and single supply (vdzMin = 40), then zd = 2.5 > 1.0
    const input = {
      zones: [createBaseZone('Z1', { voz: 100, vpzMinDesign: 40 })],
      ps: 10,
      systemType: 'single_supply' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('FAIL');
    expect(result.auditTrail.find(a => a.symbol === 'Zd')).toBeDefined();
  });

  it('CASE 5 — Missing secondary-recirculation parameter', () => {
    const input = {
      zones: [createBaseZone('Z1', { ep: null, er: 0.5 })], // missing Ep
      ps: 10,
      systemType: 'secondary_recirculation' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('INCOMPLETE');
  });

  it('CASE 6 — Existing single-zone regression', () => {
    // Zone calc doesn't use alternative procedure, but let's just make sure it runs unchanged
    const res = Ashrae621ZoneService.calculateZone({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022', // valid
      spaceType: { id: 'office', name: 'Office', standard: 'ASHRAE 62.1', edition: '2022', category: 'Office', rpMetric: 2.5, raMetric: 0.3, defaultOccupancyMetric: 5, units: 'L/s', exhaustRequired: false, reference: '', notes: '', sourceType: 1, verificationStatus: 'VERIFIED', verificationDate: '2026' } as any,
      area: 100,
      designOccupancy: 10,
      useDefaultOccupancy: false,
      ezConfig: { id: 'ez1', name: 'Ceiling', ez: 1.0, reference: '', standard: 'ASHRAE 62.1', edition: '2022', configuration: '', applicableCondition: '', supplyArrangement: '', returnArrangement: '', sourceType: 1, verificationStatus: 'VERIFIED' } as any
    });
    expect(res.status).toBe("BLOCKED");
    
  });

  it('CASE 7 — Existing simplified-procedure regression', () => {
    const res = Ashrae621SimplifiedSystemService.calculate({
      zones: [
        { id: 'Z1', rp: 2.5, ra: 0.3, az: 100, pz: 10, voz: 55, vpz: 100, vpzMinDesign: 80, dMode: 'CV' }
      ],
      ps: 10
    });
    expect(res.status).toBe("PASS");
    expect(res.vou).toBeDefined();
  });
});
