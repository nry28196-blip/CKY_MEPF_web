import { describe, it, expect } from 'vitest';
import { EzSelectionService } from '../../calculations/ventilation/EzSelectionService';
import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';

describe('ASHRAE 62.1-2022 Table 6-4 Ez Selection & Physical Conditions', () => {
  const get2022Ez = (id: string) => {
    const ez = StandardDataProvider.get621EzValues('2022').find(e => e.id === id);
    if (!ez) throw new Error(`Ez config ${id} not found`);
    return ez;
  };

  const office = StandardDataProvider.get621SpaceTypes('2022').find(s => s.id === 'office')!;

  it('resolves ceiling cooling to Ez = 1.0 (ez-1)', () => {
    const result = EzSelectionService.resolveEzFromCriteria({
      supplyLocation: 'ceiling',
      returnLocation: 'ceiling',
      supplyTempRelationship: 'cooling'
    });
    expect(result.status).toBe('PASS');
    expect(result.ez).toBe(1.0);
    expect(result.selectedConfig?.id).toBe('ez-1');
  });

  it('resolves ceiling warm air with ceiling return when DT >= 8C to Ez = 0.8 (ez-2)', () => {
    const result = EzSelectionService.resolveEzFromCriteria({
      supplyLocation: 'ceiling',
      returnLocation: 'ceiling',
      supplyTempRelationship: 'heating_gte_8c'
    });
    expect(result.status).toBe('PASS');
    expect(result.ez).toBe(0.8);
    expect(result.selectedConfig?.id).toBe('ez-2');
  });

  it('requires supplyJetVelocityMet when heating DT < 8C with ceiling return', () => {
    // Missing jet velocity
    const incomplete = EzSelectionService.resolveEzFromCriteria({
      supplyLocation: 'ceiling',
      returnLocation: 'ceiling',
      supplyTempRelationship: 'heating_lt_8c'
    });
    expect(incomplete.status).toBe('INCOMPLETE');

    // High velocity: jet reaches floor at >= 150 fpm (0.8 m/s) -> Ez = 1.0
    const highVel = EzSelectionService.resolveEzFromCriteria({
      supplyLocation: 'ceiling',
      returnLocation: 'ceiling',
      supplyTempRelationship: 'heating_lt_8c',
      supplyJetVelocityMet: true
    });
    expect(highVel.status).toBe('PASS');
    expect(highVel.ez).toBe(1.0);

    // Low velocity: jet does not reach floor at >= 150 fpm -> Ez = 0.8
    const lowVel = EzSelectionService.resolveEzFromCriteria({
      supplyLocation: 'ceiling',
      returnLocation: 'ceiling',
      supplyTempRelationship: 'heating_lt_8c',
      supplyJetVelocityMet: false
    });
    expect(lowVel.status).toBe('PASS');
    expect(lowVel.ez).toBe(0.8);
  });

  it('resolves floor supply displacement ventilation with return height dependency', () => {
    // Return height < 5.5 m -> Ez = 1.2
    const resLow = EzSelectionService.resolveEzFromCriteria({
      supplyLocation: 'floor',
      returnLocation: 'ceiling',
      supplyTempRelationship: 'cooling',
      verticalThrowMet: false, // low velocity displacement
      returnHeightGte55m: false
    });
    expect(resLow.status).toBe('PASS');
    expect(resLow.ez).toBe(1.2);
    expect(resLow.selectedConfig?.id).toBe('ez-3');

    // Return height >= 5.5 m -> Ez = 1.5
    const resHigh = EzSelectionService.resolveEzFromCriteria({
      supplyLocation: 'floor',
      returnLocation: 'ceiling',
      supplyTempRelationship: 'cooling',
      verticalThrowMet: false, // low velocity displacement
      returnHeightGte55m: true
    });
    expect(resHigh.status).toBe('PASS');
    expect(resHigh.ez).toBe(1.5);
    expect(resHigh.selectedConfig?.id).toBe('ez-floor-cool-strat-h-gte55m');
  });

  it('validates physical conditions in Ashrae621ZoneService', () => {
    // When engineer specifies ez-3 (displacement Ez = 1.2), but supplies warm air instead of cool
    const invalidTemp = Ashrae621ZoneService.calculateZone({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      spaceType: office,
      area: 100,
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: get2022Ez('ez-3'),
      supplyTempRelationship: 'heating_gte_8c'
    });
    expect(invalidTemp.status).toBe('FAIL');
    expect(invalidTemp.reason).toContain('cooling');

    // When conditions are compliant, passes
    const validCool = Ashrae621ZoneService.calculateZone({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      spaceType: office,
      area: 100,
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: get2022Ez('ez-3'),
      supplyTempRelationship: 'cooling',
      verticalThrowMet: false,
      returnHeightGte55m: false
    });
    expect(validCool.status).toBe('PASS');
    expect(validCool.ez).toBe(1.2);
  });

  it('marks manual override with NOT_VERIFIED status in resolution and BLOCKED in safety gate', () => {
    const overrideResolution = EzSelectionService.resolveEzFromCriteria({
      manualOverride: {
        ezValue: 1.1,
        basis: 'CFD simulation report #104'
      }
    });
    expect(overrideResolution.status).toBe('NOT_VERIFIED');
    expect(overrideResolution.ez).toBe(1.1);

    const result = Ashrae621ZoneService.calculateZone({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      spaceType: office,
      area: 100,
      designOccupancy: 5,
      useDefaultOccupancy: false,
      ezConfig: overrideResolution.ezConfig!
    });

    // In production safety gate, unverified data is blocked from uncertified calculation
    expect(result.status).toBe('BLOCKED');
  });
});
