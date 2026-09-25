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
    // Return height < 5.5 m -> Ez = 1.2 (Stratified Case 2)
    const resLow = EzSelectionService.resolveEzFromCriteria({
      supplyLocation: 'floor',
      returnLocation: 'ceiling',
      supplyTempRelationship: 'cooling',
      verticalThrowMet: false, // low velocity displacement
      returnHeightGte55m: false,
      stratifiedPrerequisitesMet: true
    });
    expect(resLow.status).toBe('PASS');
    expect(resLow.ez).toBe(1.2);
    expect(resLow.selectedConfig?.id).toBe('ez-3');

    // Return height >= 5.5 m -> Ez = 1.5 (Stratified Case 3)
    const resHigh = EzSelectionService.resolveEzFromCriteria({
      supplyLocation: 'floor',
      returnLocation: 'ceiling',
      supplyTempRelationship: 'cooling',
      verticalThrowMet: false, // low velocity displacement
      returnHeightGte55m: true,
      stratifiedPrerequisitesMet: true
    });
    expect(resHigh.status).toBe('PASS');
    expect(resHigh.ez).toBe(1.5);
    expect(resHigh.selectedConfig?.id).toBe('ez-floor-cool-strat-h-gte55m');

    // Case 1: vertical throw >= 0.25 m/s (60 fpm) at 1.4 m and ceiling return <= 5.5 m -> Ez = 1.05
    const resCase1 = EzSelectionService.resolveEzFromCriteria({
      supplyLocation: 'floor',
      returnLocation: 'ceiling',
      supplyTempRelationship: 'cooling',
      verticalThrowMet: true,
      returnHeightGte55m: false,
      stratifiedPrerequisitesMet: true
    });
    expect(resCase1.status).toBe('PASS');
    expect(resCase1.ez).toBe(1.05);
    expect(resCase1.selectedConfig?.id).toBe('ez-floor-cool-strat-case1');
  });

  describe('ASHRAE 62.1-2022 Table 6-4 Stratified Selection Hardening', () => {
    // 1. Missing stratified prerequisites -> INCOMPLETE
    it('returns INCOMPLETE when stratified prerequisites are omitted', () => {
      const result = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0
      });
      expect(result.status).toBe('INCOMPLETE');
      expect(result.ez).toBeNull();
      expect(result.reasons[0]).toContain('Stratified');
    });

    // 2. stratifiedPrerequisitesMet=false -> FAIL
    it('returns FAIL when compact stratifiedPrerequisitesMet is false', () => {
      const result = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisitesMet: false
      });
      expect(result.status).toBe('FAIL');
      expect(result.ez).toBeNull();
      expect(result.reasons[0]).toContain('not satisfied');
    });

    // 3. stratifiedPrerequisitesMet=true -> allowed
    it('allows resolution when compact stratifiedPrerequisitesMet is true', () => {
      const result = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisitesMet: true
      });
      expect(result.status).toBe('PASS');
      expect(result.ez).toBe(1.2);
      expect(result.selectedConfig?.id).toBe('ez-3');
    });

    // 4. Complete structured prerequisites -> allowed
    it('allows resolution when all structured prerequisites are satisfied', () => {
      const result = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          supplyTempBelowRoomGte2C: true,
          returnOpeningHeightM: 3.0,
          returnOpeningHeightGt28m: true,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(result.status).toBe('PASS');
      expect(result.ez).toBe(1.2);
    });

    // 5. Missing one structured prerequisite -> INCOMPLETE
    it('returns INCOMPLETE when any structured prerequisite is missing', () => {
      // Missing protectedFromImpingingAirstreams
      const missingProtection = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          supplyTempBelowRoomGte2C: true,
          returnOpeningHeightM: 3.0,
          returnOpeningHeightGt28m: true,
          noMechanicalMixingDevices: true
        }
      });
      expect(missingProtection.status).toBe('INCOMPLETE');
      expect(missingProtection.ez).toBeNull();

      // Missing noMechanicalMixingDevices
      const missingMixing = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          supplyTempBelowRoomGte2C: true,
          returnOpeningHeightM: 3.0,
          returnOpeningHeightGt28m: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(missingMixing.status).toBe('INCOMPLETE');
      expect(missingMixing.ez).toBeNull();

      // Missing return opening height
      const missingReturnOpening = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          supplyTempBelowRoomGte2C: true,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(missingReturnOpening.status).toBe('INCOMPLETE');
      expect(missingReturnOpening.ez).toBeNull();

      // Missing supply temperature difference
      const missingTemp = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          returnOpeningHeightM: 3.0,
          returnOpeningHeightGt28m: true,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(missingTemp.status).toBe('INCOMPLETE');
      expect(missingTemp.ez).toBeNull();
    });

    // 6. One failed structured prerequisite -> FAIL
    it('returns FAIL when any structured prerequisite is not satisfied', () => {
      // Supply temp difference < 2.0 C
      const lowTempDiff = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 1.5,
          returnOpeningHeightM: 3.0,
          returnOpeningHeightGt28m: true,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(lowTempDiff.status).toBe('FAIL');
      expect(lowTempDiff.ez).toBeNull();

      // Return opening height <= 2.8 m (exact 2.8 m fails: standard requires > 2.8 m)
      const exact28m = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          supplyTempBelowRoomGte2C: true,
          returnOpeningHeightM: 2.8,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(exact28m.status).toBe('FAIL');
      expect(exact28m.ez).toBeNull();

      // Return opening height 2.7 m fails
      const lowReturnOpening = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          supplyTempBelowRoomGte2C: true,
          returnOpeningHeightM: 2.7,
          returnOpeningHeightGt28m: false,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(lowReturnOpening.status).toBe('FAIL');
      expect(lowReturnOpening.ez).toBeNull();

      // Mechanical mixing devices present
      const mixingDevices = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          supplyTempBelowRoomGte2C: true,
          returnOpeningHeightM: 3.0,
          returnOpeningHeightGt28m: true,
          noMechanicalMixingDevices: false,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(mixingDevices.status).toBe('FAIL');
      expect(mixingDevices.ez).toBeNull();

      // Impinging airstreams not protected
      const impingingAirstreams = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          supplyTempBelowRoomGte2C: true,
          returnOpeningHeightM: 3.0,
          returnOpeningHeightGt28m: true,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: false
        }
      });
      expect(impingingAirstreams.status).toBe('FAIL');
      expect(impingingAirstreams.ez).toBeNull();
    });

    // 7. Numeric/boolean contradiction -> FAIL
    it('returns FAIL on numeric and boolean contradictions in prerequisites or return height', () => {
      // Temp diff: 3.0 C + false -> FAIL
      const tempContradiction1 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 3.0,
          supplyTempBelowRoomGte2C: false,
          returnOpeningHeightM: 3.0,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(tempContradiction1.status).toBe('FAIL');
      expect(tempContradiction1.ez).toBeNull();

      // Temp diff: 2.0 C + false -> FAIL
      const tempContradiction2 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.0,
          supplyTempBelowRoomGte2C: false,
          returnOpeningHeightM: 3.0,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(tempContradiction2.status).toBe('FAIL');
      expect(tempContradiction2.ez).toBeNull();

      // Temp diff: 1.9 C + true -> FAIL
      const tempContradiction3 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 1.9,
          supplyTempBelowRoomGte2C: true,
          returnOpeningHeightM: 3.0,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(tempContradiction3.status).toBe('FAIL');
      expect(tempContradiction3.ez).toBeNull();

      // Return opening height: 3.0 m + false -> FAIL
      const heightContradiction1 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          returnOpeningHeightM: 3.0,
          returnOpeningHeightGt28m: false,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(heightContradiction1.status).toBe('FAIL');
      expect(heightContradiction1.ez).toBeNull();

      // Return opening height: 2.8 m + true -> FAIL (2.8 is not > 2.8)
      const heightContradiction2 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          returnOpeningHeightM: 2.8,
          returnOpeningHeightGt28m: true,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(heightContradiction2.status).toBe('FAIL');
      expect(heightContradiction2.ez).toBeNull();

      // Return opening height: 2.8 m + false -> FAIL (not > 2.8 m)
      const heightContradiction3 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          returnOpeningHeightM: 2.8,
          returnOpeningHeightGt28m: false,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(heightContradiction3.status).toBe('FAIL');
      expect(heightContradiction3.ez).toBeNull();

      // Return height (5.5m boundary): 5.500 m + returnHeightGt55m: true -> FAIL
      const boundaryContradiction1 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 5.500,
        returnHeightGt55m: true,
        stratifiedPrerequisitesMet: true
      });
      expect(boundaryContradiction1.status).toBe('FAIL');
      expect(boundaryContradiction1.ez).toBeNull();

      // Return height (5.5m boundary): 5.501 m + returnHeightGt55m: false -> FAIL
      const boundaryContradiction2 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 5.501,
        returnHeightGt55m: false,
        stratifiedPrerequisitesMet: true
      });
      expect(boundaryContradiction2.status).toBe('FAIL');
      expect(boundaryContradiction2.ez).toBeNull();

      // Contradictory boolean flags: returnHeightGt55m true vs returnHeightGte55m false
      const flagContradiction = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightGt55m: true,
        returnHeightGte55m: false,
        stratifiedPrerequisitesMet: true
      });
      expect(flagContradiction.status).toBe('FAIL');
      expect(flagContradiction.ez).toBeNull();

      // Structured prerequisites met but compact stratifiedPrerequisitesMet = false -> FAIL
      const structCompactContradiction = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 4.0,
        stratifiedPrerequisitesMet: false,
        stratifiedPrerequisites: {
          tempDiffRoomSupplyC: 2.5,
          supplyTempBelowRoomGte2C: true,
          returnOpeningHeightM: 3.0,
          returnOpeningHeightGt28m: true,
          noMechanicalMixingDevices: true,
          protectedFromImpingingAirstreams: true
        }
      });
      expect(structCompactContradiction.status).toBe('FAIL');
      expect(structCompactContradiction.ez).toBeNull();
    });

    // 8. 5.499 m -> low-height case (<= 5.5 m)
    it('treats 5.499 m as low-return-height (<= 5.5 m)', () => {
      // Case 2: low throw + <= 5.5 m -> Ez = 1.20
      const resCase2 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 5.499,
        stratifiedPrerequisitesMet: true
      });
      expect(resCase2.status).toBe('PASS');
      expect(resCase2.ez).toBe(1.20);
      expect(resCase2.selectedConfig?.id).toBe('ez-3');

      // Case 1: high throw + <= 5.5 m -> Ez = 1.05
      const resCase1 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: true,
        returnHeightM: 5.499,
        stratifiedPrerequisitesMet: true
      });
      expect(resCase1.status).toBe('PASS');
      expect(resCase1.ez).toBe(1.05);
      expect(resCase1.selectedConfig?.id).toBe('ez-floor-cool-strat-case1');
    });

    // 9. 5.500 m -> low-height case (<= 5.5 m)
    it('treats exactly 5.500 m as low-return-height (<= 5.5 m boundary belongs to <= 5.5 m case)', () => {
      // Case 2: low throw + <= 5.5 m -> Ez = 1.20
      const resCase2 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 5.500,
        stratifiedPrerequisitesMet: true
      });
      expect(resCase2.status).toBe('PASS');
      expect(resCase2.ez).toBe(1.20);
      expect(resCase2.selectedConfig?.id).toBe('ez-3');

      // Case 1: high throw + <= 5.5 m -> Ez = 1.05
      const resCase1 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: true,
        returnHeightM: 5.500,
        stratifiedPrerequisitesMet: true
      });
      expect(resCase1.status).toBe('PASS');
      expect(resCase1.ez).toBe(1.05);
      expect(resCase1.selectedConfig?.id).toBe('ez-floor-cool-strat-case1');
    });

    // 10. 5.501 m -> high-height case (> 5.5 m)
    it('treats 5.501 m as high-return-height (> 5.5 m)', () => {
      // Case 3: low throw + > 5.5 m -> Ez = 1.50
      const resCase3 = EzSelectionService.resolveEzFromCriteria({
        supplyLocation: 'floor',
        returnLocation: 'ceiling',
        supplyTempRelationship: 'cooling',
        verticalThrowMet: false,
        returnHeightM: 5.501,
        stratifiedPrerequisitesMet: true
      });
      expect(resCase3.status).toBe('PASS');
      expect(resCase3.ez).toBe(1.50);
      expect(resCase3.selectedConfig?.id).toBe('ez-floor-cool-strat-h-gte55m');
    });

    // 11. Preserved Ez values: 1.05 / 1.20 / 1.50
    it('preserves exact Table 6-4 Ez values: Case 1 = 1.05, Case 2 = 1.20, Case 3 = 1.50', () => {
      const case1 = get2022Ez('ez-floor-cool-strat-case1');
      expect(case1.ez).toBe(1.05);

      const case2 = get2022Ez('ez-3');
      expect(case2.ez).toBe(1.20);

      const case3 = get2022Ez('ez-floor-cool-strat-h-gte55m');
      expect(case3.ez).toBe(1.50);
    });
  });

  it('resolves personalized ventilation configurations and enforces prerequisites', () => {
    // Missing Section 6.2.1.2.2 prerequisites -> INCOMPLETE
    const noPrereq = EzSelectionService.resolveEzFromCriteria({
      isPersonalizedVentilation: true,
      personalizedPrerequisitesMet: false,
      personalizedSystemType: 'ceiling_cool'
    });
    expect(noPrereq.status).toBe('INCOMPLETE');
    expect(noPrereq.ez).toBeNull();

    // 1. Personalized air + ceiling supply cool air + ceiling return -> Ez = 1.40
    const p1 = EzSelectionService.resolveEzFromCriteria({
      isPersonalizedVentilation: true,
      personalizedPrerequisitesMet: true,
      personalizedSystemType: 'ceiling_cool'
    });
    expect(p1.status).toBe('PASS');
    expect(p1.ez).toBe(1.40);
    expect(p1.selectedConfig?.id).toBe('ez-personalized-ceiling-cool');

    // 2. Personalized air + ceiling supply warm air + ceiling return -> Ez = 1.40
    const p2 = EzSelectionService.resolveEzFromCriteria({
      isPersonalizedVentilation: true,
      personalizedPrerequisitesMet: true,
      personalizedSystemType: 'ceiling_warm'
    });
    expect(p2.status).toBe('PASS');
    expect(p2.ez).toBe(1.40);
    expect(p2.selectedConfig?.id).toBe('ez-personalized-ceiling-warm');

    // 3. Personalized air + stratified distribution + nonaspirating floor supply devices + ceiling return -> Ez = 1.20
    const p3 = EzSelectionService.resolveEzFromCriteria({
      isPersonalizedVentilation: true,
      personalizedPrerequisitesMet: true,
      personalizedSystemType: 'stratified_nonaspirating'
    });
    expect(p3.status).toBe('PASS');
    expect(p3.ez).toBe(1.20);
    expect(p3.selectedConfig?.id).toBe('ez-personalized-strat-nonaspirating');

    // 4. Personalized air + stratified distribution + aspirating floor supply devices + ceiling return -> Ez = 1.50
    const p4 = EzSelectionService.resolveEzFromCriteria({
      isPersonalizedVentilation: true,
      personalizedPrerequisitesMet: true,
      personalizedSystemType: 'stratified_aspirating'
    });
    expect(p4.status).toBe('PASS');
    expect(p4.ez).toBe(1.50);
    expect(p4.selectedConfig?.id).toBe('ez-personalized-strat-aspirating');
  });

  it('resolves makeup air configurations based on explicit distance condition', () => {
    // Missing distance condition -> INCOMPLETE
    const missingDist = EzSelectionService.resolveEzFromCriteria({
      distributionCategory: 'makeup'
    });
    expect(missingDist.status).toBe('INCOMPLETE');
    expect(missingDist.ez).toBeNull();

    // Outlet located more than half the length of the space from exhaust/return -> Ez = 0.8
    const far = EzSelectionService.resolveEzFromCriteria({
      distributionCategory: 'makeup',
      makeupAirDistance: 'greater_than_half_length'
    });
    expect(far.status).toBe('PASS');
    expect(far.ez).toBe(0.8);
    expect(far.selectedConfig?.id).toBe('ez-makeup-more-half-length');

    // Outlet located less than half the length of the space from exhaust/return -> Ez = 0.5
    const near = EzSelectionService.resolveEzFromCriteria({
      distributionCategory: 'makeup',
      makeupAirDistance: 'less_than_half_length'
    });
    expect(near.status).toBe('PASS');
    expect(near.ez).toBe(0.5);
    expect(near.selectedConfig?.id).toBe('ez-makeup-direct-exhaust');
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
