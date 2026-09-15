import { describe, it, expect, vi } from 'vitest';
import { DataProvenanceValidationService } from '../../calculations/ventilation/DataProvenanceValidationService';
import { Ashrae621AlternativeSystemService, AlternativeZoneInput } from '../../calculations/ventilation/Ashrae621AlternativeSystemService';
import { Ashrae621SimplifiedSystemService } from '../../calculations/ventilation/Ashrae621SimplifiedSystemService';
import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';
import { SourceType } from '../../data/ventilation/ashrae621/types';

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

  it('TEST 1 — Single Supply: Confirm existing behavior remains unchanged', () => {
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

  it('TEST 2 — Secondary Recirculation Valid: Derive Ep and verify Zd', () => {
    const input = {
      zones: [createBaseZone('Z1', { voz: 40, vpzMinDesign: 40, vdzMinDesign: 80, er: 0.5 })],
      ps: 10,
      systemType: 'secondary_recirculation' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('PASS');
    const z = result.zoneResults[0];
    expect(z.ep).toBe(0.5); // 40 / 80
    expect(z.vdzMin).toBeCloseTo(80);
    expect(z.zd).toBeCloseTo(40 / 80);
  });

  it('TEST 3 — Missing VdzMin', () => {
    const input = {
      zones: [createBaseZone('Z1', { vdzMinDesign: null, er: 0.5 })],
      ps: 10,
      systemType: 'secondary_recirculation' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('INCOMPLETE');
  });

  it('TEST 4 — Missing VpzMin', () => {
    const input = {
      zones: [createBaseZone('Z1', { vpzMinDesign: null, vdzMinDesign: 80, er: 0.5 })],
      ps: 10,
      systemType: 'secondary_recirculation' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('INCOMPLETE');
  });

  it('TEST 5 — Invalid VdzMin', () => {
    const input = {
      zones: [createBaseZone('Z1', { vpzMinDesign: 40, vdzMinDesign: -10, er: 0.5 })],
      ps: 10,
      systemType: 'secondary_recirculation' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('FAIL');
  });

  it('TEST 6 — Invalid VpzMin', () => {
    const input = {
      zones: [createBaseZone('Z1', { vpzMinDesign: -10, vdzMinDesign: 80, er: 0.5 })],
      ps: 10,
      systemType: 'secondary_recirculation' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('FAIL');
  });

  it('TEST 7 — Derived Ep', () => {
    const input = {
      zones: [createBaseZone('Z1', { voz: 40, vpzMinDesign: 50, vdzMinDesign: 100, er: 0.5 })],
      ps: 10,
      systemType: 'secondary_recirculation' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('PASS');
    expect(result.zoneResults[0].ep).toBe(0.5); // 50 / 100
  });

  it('TEST 8 — Condition consistency: Show how invalid Ep > 1 fails', () => {
    // If user inputs a peak Vpz (100) but minimum Vdz (80), Ep = 100/80 = 1.25 > 1.0
    const input = {
      zones: [createBaseZone('Z1', { vpzMinDesign: 100, vdzMinDesign: 80, er: 0.5 })],
      ps: 10,
      systemType: 'secondary_recirculation' as const
    };
    const result = Ashrae621AlternativeSystemService.calculate(input);
    expect(result.status).toBe('FAIL'); // Because Ep > 1.0 is physically invalid
  });

  it('TEST 9 — Existing Alternative Procedure regression (single zone test)', () => {
    vi.spyOn(DataProvenanceValidationService, 'validateSpaceTypeData').mockReturnValue({ valid: true, status: 'PASS', reasons: [] });
    vi.spyOn(DataProvenanceValidationService, 'validateEzData').mockReturnValue({ valid: true, status: 'PASS', reasons: [] });
    const res = Ashrae621ZoneService.calculateZone({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      spaceType: { id: 'office', name: 'Office', standard: 'ASHRAE 62.1', edition: '2022', category: 'Office', rpMetric: 2.5, raMetric: 0.3, defaultOccupancyMetric: 5, units: 'L/s', exhaustRequired: false, reference: 'Test', notes: '', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026', revisionState: { source: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026' } } as any,
      area: 100,
      designOccupancy: 10,
      useDefaultOccupancy: false,
      ezConfig: { id: 'ez1', name: 'Ceiling', ez: 1.0, reference: 'Test', standard: 'ASHRAE 62.1', edition: '2022', configuration: '', applicableCondition: '', supplyArrangement: '', returnArrangement: '', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revisionState: { source: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026' } } as any
    });
    // This single zone should evaluate based on single zone properties
    expect(res.status).toBe('PASS');
    expect(res.voz).toBeCloseTo((2.5 * 10 + 0.3 * 100) / 1.0); // Voz = (Rp*Pz + Ra*Az) / Ez = (25 + 30)/1.0 = 55
  });

  it('TEST 10 — Existing Simplified Procedure regression', () => {
    const res = Ashrae621SimplifiedSystemService.calculate({
      zones: [
        { id: 'Z1', rp: 2.5, ra: 0.3, az: 100, pz: 10, voz: 55, vpz: 100, vpzMinDesign: 80, dMode: 'CV' }
      ],
      ps: 10
    });
    expect(res.status).toBe('PASS');
    expect(res.vou).toBeDefined();
  });
});