import { describe, it, expect } from 'vitest';
import { DensityCorrectionService } from '../../../lib/DensityCorrectionService';
import { Ashrae621ZoneService } from '../../../calculations/ventilation/Ashrae621ZoneService';
import { Ashrae621SimplifiedSystemService } from '../../../calculations/ventilation/Ashrae621SimplifiedSystemService';
import { Ashrae621AlternativeSystemService } from '../../../calculations/ventilation/Ashrae621AlternativeSystemService';
import { VentilationEngine } from '../../../lib/VentilationEngine';

describe('ASHRAE 62.1-2022 Addendum j Density Equivalence', () => {
  it('MATHEMATICAL TEST: Produces Eρ = 1.0 at standard conditions', () => {
    const res = DensityCorrectionService.calculate({ elevation: 0, temperature: 20, relativeHumidity: 0 });
    expect(res.eRho).toBeCloseTo(1.0, 3);
  });

  it('MATHEMATICAL TEST: Produces Eρ > 1.0 at high elevation (Denver ~1600m)', () => {
    const res = DensityCorrectionService.calculate({ elevation: 1600, temperature: 20, relativeHumidity: 0 });
    expect(res.eRho).toBeGreaterThan(1.1);
  });

  const validRevision = { source: 'ASHRAE_PUBLISHED', publishedErrataApplied: [], publishedAddendaApplied: [], baseEdition: '2022', verificationDate: '2026-09-08', standard: 'ASHRAE 62.1', edition: '2022' };

  it('SOURCE-BASED 62.1-2022 TEST: Zone Voz is corrected precisely by Eρ', () => {
    const zoneInput = {
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      spaceType: {
        id: 'office',
        name: 'Office space',
        standard: 'ASHRAE 62.1',
        edition: '2022',
        category: 'Office',
        rpMetric: 2.5,
        raMetric: 0.3,
        defaultOccupancyMetric: 5,
        units: 'L/s-person, L/s-m2',
        exhaustRequired: false,
        reference: 'Table 6.2.2.1',
        notes: '',
        sourceType: 'ASHRAE_PUBLISHED' as any,
        verificationStatus: 'VERIFIED' as any,
        verificationDate: '2026-09-08',
        revisionState: validRevision as any
      },
      area: 100, // ra = 0.3 * 100 = 30
      designOccupancy: 10, // rp = 2.5 * 10 = 25
      useDefaultOccupancy: false,
      ezConfig: { 
        ez: 1.0, 
        standard: 'ASHRAE 62.1',
        edition: '2022',
        reference: 'Table 6.2.2.2', 
        sourceType: 'ASHRAE_PUBLISHED' as any, 
        verificationStatus: 'VERIFIED' as any,
        verificationDate: '2026-09-08',
        revisionState: validRevision as any
      },
      eRho: 1.2
    };

    const res = Ashrae621ZoneService.calculateZone(zoneInput as any);
    if (!res.voz) console.log(res.status, res.reason);
    expect(res.voz).toBeCloseTo(55 * 1.2, 3);
  });
  
  it('SOURCE-BASED 62.1-2022 TEST: Simplified Multi-zone Vou is corrected precisely by Eρ', () => {
    const res = Ashrae621SimplifiedSystemService.calculate({
        zones: [
            { id: 'z1', pz: 10, rp: 2.5, ra: 0.3, az: 100, voz: 66, vpz: 100, vpzMinDesign: 100, dMode: 'CV' }
        ],
        ps: 10,
        eRho: 1.2
    });
    expect(res.vou).toBeCloseTo(66, 3);
  });

  it('SOURCE-BASED 62.1-2022 TEST: Alternative/VAV density correction entering Zd', () => {
    const res = Ashrae621AlternativeSystemService.calculate({
        zones: [
            { id: 'z1', pz: 10, rp: 2.5, ra: 0.3, az: 100, voz: 66, vpz: 100, vpzMinRequired: 66, vpzMinDesign: 110, vdzMinDesign: 110, ep: 1.0, er: 0, ez: 1.0, dMode: 'VAV' }
        ],
        ps: 10,
        systemType: 'single_supply',
        edition: '2022',
        eRho: 1.2
    });
    expect(res.zoneResults[0].zd).toBeCloseTo(0.6, 3);
  });
});

describe('Double Correction Prevention', () => {
  it('MATHEMATICAL TEST: Vot does not double-count Erho', () => {
    const validRevision = { source: 'ASHRAE_PUBLISHED', publishedErrataApplied: [], publishedAddendaApplied: [], baseEdition: '2022', verificationDate: '2026-09-08', standard: 'ASHRAE 62.1', edition: '2022' };
    const multiZoneInput = {
      method: 'Simplified' as const,
      edition: '2022' as const,
      systemPopulation: 10,
      systemType: 'single_supply' as const,
      density: { elevation: 1600, temperature: 20, relativeHumidity: 0 },
      zones: [{
        id: 'z1',
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2022',
        spaceType: {
            id: 'office', name: 'Office space', standard: 'ASHRAE 62.1', edition: '2022', category: 'Office',
            rpMetric: 2.5, raMetric: 0.3, defaultOccupancyMetric: 5, units: '', exhaustRequired: false,
            reference: 'Table 6.2.2.1', notes: '', sourceType: 'ASHRAE_PUBLISHED' as any, verificationStatus: 'VERIFIED' as any,
            verificationDate: '2026-09-08', revisionState: validRevision as any
        },
        area: 100, designOccupancy: 10, useDefaultOccupancy: false,
        ezConfig: { 
            ez: 1.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.2', 
            sourceType: 'ASHRAE_PUBLISHED' as any, verificationStatus: 'VERIFIED' as any,
            verificationDate: '2026-09-08', revisionState: validRevision as any
        },
        vpz: 100, vpzMinDesign: 100, vdzMinDesign: 100, ep: 1.0, er: 0, dMode: 'CV' as const
      }]
    };

    const res = VentilationEngine.runMultiZone(multiZoneInput as any);
    const eRho = res.density.eRho;
    expect(eRho).toBeGreaterThan(1.1);
    expect(res.vou).toBeCloseTo(55 * eRho, 3);
    expect(res.votDensityCorrected).toBeCloseTo((55 * eRho) / 0.75, 3);
  });
});
