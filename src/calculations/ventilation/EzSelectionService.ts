import { Ashrae621Ez, SourceType } from '../../data/ventilation/ashrae621/types';
import { ASHRAE_621_2022_EZ_VALUES } from '../../data/ventilation/ashrae621/2022/data';
import { ValidationStatus } from './VentilationValidationService';

export interface PersonalizedVentilationPrerequisites {
  /** Personalized air distributed in the breathing zone */
  airDistributedInBreathingZone?: boolean | null;
  /** Velocity at occupant head/facial region (m/s). Must be <= 0.25 m/s */
  headRegionVelocityMs?: number | null;
  /** Or boolean indicating velocity <= 0.25 m/s */
  headRegionVelocityMet?: boolean | null;
  /** Return air openings/pathways height above floor (m). Must be > 2.8 m */
  returnOpeningHeightM?: number | null;
  /** Or boolean indicating return opening height > 2.8 m */
  returnOpeningHeightGt28m?: boolean | null;
}

export interface StratifiedSystemPrerequisites {
  /** Cool supply air at least 2°C below average room air temperature */
  tempDiffRoomSupplyC?: number | null;
  supplyTempBelowRoomGte2C?: boolean | null;
  /** Return air openings/pathways located > 2.8 m above floor */
  returnOpeningHeightM?: number | null;
  returnOpeningHeightGt28m?: boolean | null;
  /** No devices that mechanically mix the air */
  noMechanicalMixingDevices?: boolean | null;
  /** Protection from impinging airstreams from adjacent ventilation zones */
  protectedFromImpingingAirstreams?: boolean | null;
}

export interface EzSelectionCriteria {
  distributionCategory?: 'ceiling' | 'floor' | 'makeup' | 'personalized' | 'unidirectional' | 'override' | 'stratified';
  supplyLocation?: 'ceiling' | 'floor' | 'breathing_zone' | 'other';
  returnLocation?: 'ceiling' | 'floor' | 'other';
  supplyAirCondition?: 'cool' | 'warm' | 'isothermal' | 'any';
  spaceTempRelationship?: 'cooling' | 'heating_gte_8c' | 'heating_lt_8c' | 'none' | null;
  supplyTempRelationship?: 'cooling' | 'heating_gte_8c' | 'heating_lt_8c' | 'none' | null;
  supplyJetVelocityMet?: boolean | null; // true if supply jet velocity >= 0.8 m/s (150 fpm) within 1.4 m of floor
  verticalThrowMet?: boolean | null; // true if vertical throw of cool air >= 0.25 m/s (60 fpm) at 1.4 m
  returnHeightM?: number | null; // Exact return height (m). Boundary is > 5.5 m vs <= 5.5 m.
  returnHeightGt55m?: boolean | null; // true if return height > 5.5 m (18 ft); false if <= 5.5 m
  returnHeightGte55m?: boolean | null; // Backward compatibility alias for returnHeightGt55m
  isDirectMakeupExhaust?: boolean;
  makeupAirDistance?: 'greater_than_half_length' | 'less_than_half_length' | null; // relative to half space length
  isPersonalizedVentilation?: boolean;
  personalizedPrerequisites?: PersonalizedVentilationPrerequisites;
  personalizedPrerequisitesMet?: boolean | null; // Section 6.2.1.2.2 prerequisites verified
  personalizedSystemType?: 'ceiling_cool' | 'ceiling_warm' | 'stratified_nonaspirating' | 'stratified_aspirating' | null;
  stratifiedPrerequisites?: StratifiedSystemPrerequisites;
  stratifiedPrerequisitesMet?: boolean | null; // Section 6.2.1.2.1 prerequisites verified
  manualOverride?: {
    ezValue: number;
    basis: string;
  };
}

export interface EzValidationConditions {
  supplyTempRelationship?: 'cooling' | 'heating_gte_8c' | 'heating_lt_8c' | 'none' | null;
  verticalThrowMet?: boolean | null;
  returnHeightGte55m?: boolean | null;
  supplyJetVelocityMet?: boolean | null;
}

export interface EzResolutionResult {
  ezConfig: Ashrae621Ez | null;
  selectedConfig?: Ashrae621Ez | null;
  ez?: number | null;
  status: ValidationStatus;
  reasons: string[];
}

export class EzSelectionService {
  /**
   * Retrieves all Table 6-4 records for the 2022 standard edition.
   * Note: Contains both verified records and non-production unverified records (e.g., ez-unidirectional-flow).
   */
  static getTable64Values(): Ashrae621Ez[] {
    return ASHRAE_621_2022_EZ_VALUES;
  }

  /**
   * Retrieves only production-verified Table 6-4 records for the 2022 standard edition.
   */
  static getVerifiedTable64Values(): Ashrae621Ez[] {
    return ASHRAE_621_2022_EZ_VALUES.filter(e => e.verificationStatus === 'VERIFIED' && e.id !== 'ez-unidirectional-flow');
  }

  /**
   * Creates a properly labeled Manual Engineering Override record.
   * This is never labeled "ASHRAE Table 6-4".
   */
  static createManualOverride(ezValue: number, basis: string, edition: string = '2022'): Ashrae621Ez {
    return {
      id: `manual-override-${Date.now()}`,
      name: 'Manual Engineering Override',
      standard: 'ASHRAE 62.1',
      edition,
      configuration: 'Manual Engineering Override',
      applicableCondition: basis || 'User specified override',
      supplyArrangement: 'Custom',
      returnArrangement: 'Custom',
      ez: ezValue,
      reference: 'Manual Engineering Override (Non-Table 6-4)',
      distributionCategory: 'override',
      isManualOverride: true,
      manualOverrideBasis: basis,
      sourceType: SourceType.USER_OVERRIDE,
      verificationStatus: 'NOT_VERIFIED',
      verificationDate: new Date().toISOString().split('T')[0],
      revisionState: {
        standard: 'ASHRAE 62.1',
        edition: '2022',
        baseEdition: '2022',
        publishedAddendaApplied: [],
        publishedErrataApplied: [],
        verificationDate: new Date().toISOString().split('T')[0],
        source: SourceType.USER_OVERRIDE
      }
    };
  }

  /**
   * Resolves a standard-derived Table 6-4 Ez record from physical system configuration inputs.
   */
  static resolveEzFromCriteria(criteria: EzSelectionCriteria): EzResolutionResult {
    // 1. Check for manual override
    if (criteria.manualOverride) {
      if (!criteria.manualOverride.basis || criteria.manualOverride.basis.trim() === '') {
        return {
          ezConfig: null,
          selectedConfig: null,
          ez: null,
          status: 'INCOMPLETE',
          reasons: ['Missing engineering justification for Ez manual override']
        };
      }
      const overrideConfig = this.createManualOverride(criteria.manualOverride.ezValue, criteria.manualOverride.basis);
      return {
        ezConfig: overrideConfig,
        selectedConfig: overrideConfig,
        ez: overrideConfig.ez,
        status: 'NOT_VERIFIED',
        reasons: ['Manual Engineering Override - Non-standard basis']
      };
    }

    // 2. Unidirectional flow protection: Non-production / UNIMPLEMENTED
    if (criteria.distributionCategory === 'unidirectional' ||
        (criteria.supplyLocation === 'ceiling' && criteria.returnLocation === 'floor' && criteria.supplyAirCondition === 'isothermal')) {
      const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-unidirectional-flow') || null;
      return {
        ezConfig: config,
        selectedConfig: config,
        ez: null,
        status: 'BLOCKED',
        reasons: ['Unidirectional downward flow through perforated ceiling is UNIMPLEMENTED / NOT_VERIFIED for production engineering calculations.']
      };
    }

    // 3. Contradiction Detection (Do not silently resolve contradictory criteria)
    if (criteria.supplyAirCondition === 'warm' && (criteria.spaceTempRelationship === 'cooling' || criteria.supplyTempRelationship === 'cooling')) {
      return {
        ezConfig: null,
        selectedConfig: null,
        ez: null,
        status: 'FAIL',
        reasons: ['Contradictory supply air condition and temperature relationship: supplyAirCondition is warm but temperature relationship is cooling.']
      };
    }

    if (criteria.supplyAirCondition === 'cool' && (
      criteria.spaceTempRelationship === 'heating_gte_8c' || criteria.spaceTempRelationship === 'heating_lt_8c' ||
      criteria.supplyTempRelationship === 'heating_gte_8c' || criteria.supplyTempRelationship === 'heating_lt_8c'
    )) {
      return {
        ezConfig: null,
        selectedConfig: null,
        ez: null,
        status: 'FAIL',
        reasons: ['Contradictory supply air condition and temperature relationship: supplyAirCondition is cool but temperature relationship is heating.']
      };
    }

    if (criteria.spaceTempRelationship && criteria.supplyTempRelationship && criteria.spaceTempRelationship !== criteria.supplyTempRelationship) {
      const isSpaceCool = criteria.spaceTempRelationship === 'cooling';
      const isSupplyCool = criteria.supplyTempRelationship === 'cooling';
      if (isSpaceCool !== isSupplyCool) {
        return {
          ezConfig: null,
          selectedConfig: null,
          ez: null,
          status: 'FAIL',
          reasons: ['Contradictory spaceTempRelationship and supplyTempRelationship specified.']
        };
      }
    }

    if (criteria.distributionCategory === 'ceiling' && criteria.supplyLocation && criteria.supplyLocation !== 'ceiling') {
      return {
        ezConfig: null,
        selectedConfig: null,
        ez: null,
        status: 'FAIL',
        reasons: [`Contradictory distribution category 'ceiling' with supply location '${criteria.supplyLocation}'.`]
      };
    }

    if (criteria.distributionCategory === 'floor' && criteria.supplyLocation && criteria.supplyLocation !== 'floor') {
      return {
        ezConfig: null,
        selectedConfig: null,
        ez: null,
        status: 'FAIL',
        reasons: [`Contradictory distribution category 'floor' with supply location '${criteria.supplyLocation}'.`]
      };
    }

    if (criteria.distributionCategory === 'stratified') {
      if (criteria.supplyLocation && criteria.supplyLocation !== 'floor') {
        return {
          ezConfig: null,
          selectedConfig: null,
          ez: null,
          status: 'FAIL',
          reasons: [`Contradictory distribution category 'stratified' with supply location '${criteria.supplyLocation}'.`]
        };
      }
      if (criteria.returnLocation && criteria.returnLocation !== 'ceiling') {
        return {
          ezConfig: null,
          selectedConfig: null,
          ez: null,
          status: 'FAIL',
          reasons: [`Contradictory distribution category 'stratified' with return location '${criteria.returnLocation}'.`]
        };
      }
      if (
        criteria.supplyAirCondition === 'warm' ||
        criteria.spaceTempRelationship === 'heating_gte_8c' ||
        criteria.spaceTempRelationship === 'heating_lt_8c' ||
        criteria.supplyTempRelationship === 'heating_gte_8c' ||
        criteria.supplyTempRelationship === 'heating_lt_8c'
      ) {
        return {
          ezConfig: null,
          selectedConfig: null,
          ez: null,
          status: 'FAIL',
          reasons: ['Contradictory stratified configuration: stratified distribution requires cooling supply air.']
        };
      }
    }

    // TASK 3 — Breathing-zone and personalized consistency checks
    if (
      criteria.isPersonalizedVentilation === false &&
      (criteria.personalizedSystemType ||
       criteria.distributionCategory === 'personalized' ||
       criteria.supplyLocation === 'breathing_zone' ||
       criteria.personalizedPrerequisites !== undefined ||
       criteria.personalizedPrerequisitesMet === true)
    ) {
      return {
        ezConfig: null,
        selectedConfig: null,
        ez: null,
        status: 'FAIL',
        reasons: ['Contradictory personalized configuration: isPersonalizedVentilation is false but a personalized ventilation configuration was specified.']
      };
    }

    if (criteria.personalizedSystemType && criteria.supplyLocation && criteria.supplyLocation !== 'breathing_zone') {
      return {
        ezConfig: null,
        selectedConfig: null,
        ez: null,
        status: 'FAIL',
        reasons: [`Contradictory personalized configuration: personalized system type '${criteria.personalizedSystemType}' cannot have non-breathing-zone supply location '${criteria.supplyLocation}'.`]
      };
    }

    if (criteria.distributionCategory === 'personalized' && criteria.supplyLocation && criteria.supplyLocation !== 'breathing_zone') {
      return {
        ezConfig: null,
        selectedConfig: null,
        ez: null,
        status: 'FAIL',
        reasons: [`Contradictory configuration: personalized distribution category requires breathing zone supply location, received '${criteria.supplyLocation}'.`]
      };
    }

    if (criteria.distributionCategory && criteria.distributionCategory !== 'personalized' && (criteria.personalizedSystemType || criteria.isPersonalizedVentilation)) {
      return {
        ezConfig: null,
        selectedConfig: null,
        ez: null,
        status: 'FAIL',
        reasons: [`Contradictory configuration: distribution category '${criteria.distributionCategory}' is incompatible with personalized ventilation.`]
      };
    }

    if ((criteria.isPersonalizedVentilation || criteria.distributionCategory === 'personalized' || criteria.personalizedSystemType) && criteria.returnLocation && criteria.returnLocation !== 'ceiling') {
      return {
        ezConfig: null,
        selectedConfig: null,
        ez: null,
        status: 'FAIL',
        reasons: [`Contradictory configuration: personalized ventilation requires ceiling return, received '${criteria.returnLocation}'.`]
      };
    }

    // Determine supply air condition and temperature relationship
    let supplyAirCondition = criteria.supplyAirCondition;
    let spaceTempRelationship = criteria.spaceTempRelationship || criteria.supplyTempRelationship;
    if (!supplyAirCondition && spaceTempRelationship) {
      if (spaceTempRelationship === 'cooling') supplyAirCondition = 'cool';
      else if (spaceTempRelationship === 'heating_gte_8c' || spaceTempRelationship === 'heating_lt_8c') supplyAirCondition = 'warm';
    }

    // 4. Personalized ventilation (Table 6-4 & Section 6.2.1.2.2)
    const isPersonalized = Boolean(
      criteria.isPersonalizedVentilation ||
      criteria.distributionCategory === 'personalized' ||
      criteria.supplyLocation === 'breathing_zone' ||
      criteria.personalizedSystemType
    );

    if (isPersonalized) {
      // Must verify Section 6.2.1.2.2 prerequisites before returning standard Ez
      const pReq = criteria.personalizedPrerequisites;
      if (pReq) {
        // 1. Breathing zone distribution check
        if (pReq.airDistributedInBreathingZone === undefined || pReq.airDistributedInBreathingZone === null) {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'INCOMPLETE',
            reasons: ['Personalized ventilation prerequisite missing: airDistributedInBreathingZone must be verified.']
          };
        }
        if (pReq.airDistributedInBreathingZone === false) {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'FAIL',
            reasons: ['Section 6.2.1.2.2 violation: personalized air is not distributed in the breathing zone.']
          };
        }

        // 2. Head/facial region velocity check (<= 0.25 m/s)
        let velocityConditionMet: boolean | null = null;
        const hasNumericVel = typeof pReq.headRegionVelocityMs === 'number';
        const hasBoolVel = typeof pReq.headRegionVelocityMet === 'boolean';

        if (hasNumericVel && hasBoolVel) {
          const numericMet = (pReq.headRegionVelocityMs as number) <= 0.25;
          if (numericMet !== pReq.headRegionVelocityMet) {
            return {
              ezConfig: null,
              selectedConfig: null,
              ez: null,
              status: 'FAIL',
              reasons: [`Contradictory personalized prerequisites: occupant head region velocity (${pReq.headRegionVelocityMs} m/s) contradicts headRegionVelocityMet (${pReq.headRegionVelocityMet}).`]
            };
          }
          if (!numericMet) {
            return {
              ezConfig: null,
              selectedConfig: null,
              ez: null,
              status: 'FAIL',
              reasons: [`Section 6.2.1.2.2 violation: velocity at occupant head region (${pReq.headRegionVelocityMs} m/s) exceeds 0.25 m/s limit.`]
            };
          }
          velocityConditionMet = true;
        } else if (hasNumericVel) {
          if ((pReq.headRegionVelocityMs as number) > 0.25) {
            return {
              ezConfig: null,
              selectedConfig: null,
              ez: null,
              status: 'FAIL',
              reasons: [`Section 6.2.1.2.2 violation: velocity at occupant head region (${pReq.headRegionVelocityMs} m/s) exceeds 0.25 m/s limit.`]
            };
          }
          velocityConditionMet = true;
        } else if (hasBoolVel) {
          if (pReq.headRegionVelocityMet === false) {
            return {
              ezConfig: null,
              selectedConfig: null,
              ez: null,
              status: 'FAIL',
              reasons: ['Section 6.2.1.2.2 violation: velocity at occupant head region exceeds 0.25 m/s limit.']
            };
          }
          velocityConditionMet = true;
        }

        if (velocityConditionMet === null) {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'INCOMPLETE',
            reasons: ['Personalized ventilation prerequisite missing: velocity at occupant head region must be verified (<= 0.25 m/s).']
          };
        }

        // 3. Return opening height check (> 2.8 m above floor)
        let returnOpeningConditionMet: boolean | null = null;
        const hasNumericHeight = typeof pReq.returnOpeningHeightM === 'number';
        const hasBoolHeight = typeof pReq.returnOpeningHeightGt28m === 'boolean';

        if (hasNumericHeight && hasBoolHeight) {
          const numericMet = (pReq.returnOpeningHeightM as number) > 2.8;
          if (numericMet !== pReq.returnOpeningHeightGt28m) {
            return {
              ezConfig: null,
              selectedConfig: null,
              ez: null,
              status: 'FAIL',
              reasons: [`Contradictory personalized prerequisites: return opening height (${pReq.returnOpeningHeightM} m) contradicts returnOpeningHeightGt28m (${pReq.returnOpeningHeightGt28m}).`]
            };
          }
          if (!numericMet) {
            return {
              ezConfig: null,
              selectedConfig: null,
              ez: null,
              status: 'FAIL',
              reasons: [`Section 6.2.1.2.2 violation: return opening height (${pReq.returnOpeningHeightM} m) is not greater than 2.8 m above floor.`]
            };
          }
          returnOpeningConditionMet = true;
        } else if (hasNumericHeight) {
          if ((pReq.returnOpeningHeightM as number) <= 2.8) {
            return {
              ezConfig: null,
              selectedConfig: null,
              ez: null,
              status: 'FAIL',
              reasons: [`Section 6.2.1.2.2 violation: return opening height (${pReq.returnOpeningHeightM} m) is not greater than 2.8 m above floor.`]
            };
          }
          returnOpeningConditionMet = true;
        } else if (hasBoolHeight) {
          if (pReq.returnOpeningHeightGt28m === false) {
            return {
              ezConfig: null,
              selectedConfig: null,
              ez: null,
              status: 'FAIL',
              reasons: ['Section 6.2.1.2.2 violation: return opening height is not greater than 2.8 m above floor.']
            };
          }
          returnOpeningConditionMet = true;
        }

        if (returnOpeningConditionMet === null) {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'INCOMPLETE',
            reasons: ['Personalized ventilation prerequisite missing: return opening height must be verified (> 2.8 m above floor).']
          };
        }

        // Contradiction with compact representation personalizedPrerequisitesMet if provided
        if (criteria.personalizedPrerequisitesMet === false) {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'FAIL',
            reasons: ['Contradictory personalized prerequisites: structured prerequisites provided but personalizedPrerequisitesMet is false.']
          };
        }
      } else if (criteria.personalizedPrerequisitesMet === false) {
        return {
          ezConfig: null,
          selectedConfig: null,
          ez: null,
          status: 'FAIL',
          reasons: ['Personalized ventilation prerequisites under Section 6.2.1.2.2 not satisfied.']
        };
      } else if (criteria.personalizedPrerequisitesMet !== true) {
        return {
          ezConfig: null,
          selectedConfig: null,
          ez: null,
          status: 'INCOMPLETE',
          reasons: ['Personalized ventilation prerequisites under ASHRAE 62.1-2022 Section 6.2.1.2.2 must be verified (personalized air in breathing zone, head region velocity <= 0.25 m/s, return opening height > 2.8 m).']
        };
      }

      const pType = criteria.personalizedSystemType;
      if (!pType) {
        return {
          ezConfig: null,
          selectedConfig: null,
          ez: null,
          status: 'INCOMPLETE',
          reasons: ['Missing Table 6-4 personalized ventilation system type (ceiling_cool, ceiling_warm, stratified_nonaspirating, or stratified_aspirating).']
        };
      }

      if (pType === 'ceiling_cool') {
        if (supplyAirCondition === 'warm' || spaceTempRelationship === 'heating_gte_8c' || spaceTempRelationship === 'heating_lt_8c') {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'FAIL',
            reasons: ['Contradictory configuration: ceiling_cool personalized ventilation cannot use warm supply air.']
          };
        }
        const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-personalized-ceiling-cool')!;
        return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
      }
      if (pType === 'ceiling_warm') {
        if (supplyAirCondition === 'cool' || spaceTempRelationship === 'cooling') {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'FAIL',
            reasons: ['Contradictory configuration: ceiling_warm personalized ventilation cannot use cool supply air.']
          };
        }
        const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-personalized-ceiling-warm')!;
        return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
      }
      if (pType === 'stratified_nonaspirating') {
        if (supplyAirCondition === 'warm' || spaceTempRelationship === 'heating_gte_8c' || spaceTempRelationship === 'heating_lt_8c') {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'FAIL',
            reasons: ['Contradictory configuration: stratified_nonaspirating personalized ventilation requires cooling supply air.']
          };
        }
        const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-personalized-strat-nonaspirating')!;
        return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
      }
      if (pType === 'stratified_aspirating') {
        if (supplyAirCondition === 'warm' || spaceTempRelationship === 'heating_gte_8c' || spaceTempRelationship === 'heating_lt_8c') {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'FAIL',
            reasons: ['Contradictory configuration: stratified_aspirating personalized ventilation requires cooling supply air.']
          };
        }
        const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-personalized-strat-aspirating')!;
        return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
      }
    }

    // 5. Makeup supply air (Table 6-4)
    if (criteria.distributionCategory === 'makeup' || criteria.isDirectMakeupExhaust) {
      if (!criteria.makeupAirDistance) {
        return {
          ezConfig: null,
          selectedConfig: null,
          ez: null,
          status: 'INCOMPLETE',
          reasons: ['Missing makeup supply outlet location relative to half the length of the space from exhaust/return.']
        };
      }

      if (criteria.makeupAirDistance === 'greater_than_half_length') {
        const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-makeup-more-half-length')!;
        return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
      }

      if (criteria.makeupAirDistance === 'less_than_half_length') {
        const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-makeup-direct-exhaust')!;
        return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
      }
    }

    // 6. Ceiling supply configurations
    if (criteria.supplyLocation === 'ceiling') {
      // 6a. Ceiling supply of cool air
      if (supplyAirCondition === 'cool' || spaceTempRelationship === 'cooling') {
        const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-1')!;
        return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
      }

      // 6b. Ceiling supply of warm air
      if (supplyAirCondition === 'warm' || spaceTempRelationship === 'heating_gte_8c' || spaceTempRelationship === 'heating_lt_8c') {
        // Floor return
        if (criteria.returnLocation === 'floor') {
          const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-ceil-warm-floor-ret')!;
          return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
        }

        // Ceiling return requires space temperature relationship
        if (criteria.returnLocation === 'ceiling') {
          if (!spaceTempRelationship || spaceTempRelationship === 'none') {
            return {
              ezConfig: null,
              selectedConfig: null,
              ez: null,
              status: 'INCOMPLETE',
              reasons: ['Missing supply temperature relationship']
            };
          }

          if (spaceTempRelationship === 'heating_gte_8c') {
            const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-2')!;
            return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
          }

          if (spaceTempRelationship === 'heating_lt_8c') {
            if (criteria.supplyJetVelocityMet === null || criteria.supplyJetVelocityMet === undefined) {
              return {
                ezConfig: null,
                selectedConfig: null,
                ez: null,
                status: 'INCOMPLETE',
                reasons: ['Missing supply jet velocity condition']
              };
            }

            if (criteria.supplyJetVelocityMet) {
              const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-ceil-warm-lt8c-highvel')!;
              return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
            } else {
              const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-ceil-warm-lt8c-lowvel')!;
              return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
            }
          }
        }
      }
    }

    // 7. Floor supply configurations / Stratified cooling
    const isFloorSupply = criteria.supplyLocation === 'floor' || criteria.distributionCategory === 'stratified';
    if (isFloorSupply) {
      const returnLocation = criteria.returnLocation || (criteria.distributionCategory === 'stratified' ? 'ceiling' : undefined);
      // 7a. Floor supply of warm air
      if (supplyAirCondition === 'warm' || spaceTempRelationship === 'heating_gte_8c' || spaceTempRelationship === 'heating_lt_8c') {
        if (returnLocation === 'floor') {
          const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-floor-warm-floor-ret')!;
          return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
        }
        if (returnLocation === 'ceiling') {
          const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-floor-warm-ceil-ret')!;
          return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
        }
      }

      // 7b. Floor supply of cool air and ceiling return (Stratified cooling)
      const isCoolAir = supplyAirCondition === 'cool' || spaceTempRelationship === 'cooling' || (criteria.distributionCategory === 'stratified' && !supplyAirCondition && !spaceTempRelationship);
      if (isCoolAir && returnLocation === 'ceiling') {
        // Validate Section 6.2.1.2.1 stratified system prerequisites
        const sReq = criteria.stratifiedPrerequisites;
        if (sReq) {
          // Check for contradictions and failed conditions in supply temperature
          let supplyTempConditionMet: boolean | null = null;
          const hasNumericTemp = typeof sReq.tempDiffRoomSupplyC === 'number';
          const hasBoolTemp = typeof sReq.supplyTempBelowRoomGte2C === 'boolean';

          if (hasNumericTemp && hasBoolTemp) {
            const numericMet = (sReq.tempDiffRoomSupplyC as number) >= 2.0;
            if (numericMet !== sReq.supplyTempBelowRoomGte2C) {
              return {
                ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
                reasons: [`Contradictory stratified prerequisites: supply temperature difference (${sReq.tempDiffRoomSupplyC}°C) contradicts supplyTempBelowRoomGte2C (${sReq.supplyTempBelowRoomGte2C}).`]
              };
            }
            if (!numericMet) {
              return {
                ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
                reasons: [`Section 6.2.1.2.1 violation: supply air temperature difference (${sReq.tempDiffRoomSupplyC}°C) is less than required 2°C below room temperature.`]
              };
            }
            supplyTempConditionMet = true;
          } else if (hasNumericTemp) {
            if ((sReq.tempDiffRoomSupplyC as number) < 2.0) {
              return {
                ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
                reasons: [`Section 6.2.1.2.1 violation: supply air temperature difference (${sReq.tempDiffRoomSupplyC}°C) is less than required 2°C below room temperature.`]
              };
            }
            supplyTempConditionMet = true;
          } else if (hasBoolTemp) {
            if (sReq.supplyTempBelowRoomGte2C === false) {
              return {
                ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
                reasons: ['Section 6.2.1.2.1 violation: supply air is not at least 2°C below room temperature.']
              };
            }
            supplyTempConditionMet = true;
          }

          // Check for contradictions and failed conditions in return opening height (> 2.8 m)
          let returnOpeningConditionMet: boolean | null = null;
          const hasNumericHeight = typeof sReq.returnOpeningHeightM === 'number';
          const hasBoolHeight = typeof sReq.returnOpeningHeightGt28m === 'boolean';

          if (hasNumericHeight && hasBoolHeight) {
            const numericMet = (sReq.returnOpeningHeightM as number) > 2.8;
            if (numericMet !== sReq.returnOpeningHeightGt28m) {
              return {
                ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
                reasons: [`Contradictory stratified prerequisites: return opening height (${sReq.returnOpeningHeightM} m) contradicts returnOpeningHeightGt28m (${sReq.returnOpeningHeightGt28m}).`]
              };
            }
            if (!numericMet) {
              return {
                ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
                reasons: [`Section 6.2.1.2.1 violation: return opening height (${sReq.returnOpeningHeightM} m) is not greater than 2.8 m above floor.`]
              };
            }
            returnOpeningConditionMet = true;
          } else if (hasNumericHeight) {
            if ((sReq.returnOpeningHeightM as number) <= 2.8) {
              return {
                ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
                reasons: [`Section 6.2.1.2.1 violation: return opening height (${sReq.returnOpeningHeightM} m) is not greater than 2.8 m above floor.`]
              };
            }
            returnOpeningConditionMet = true;
          } else if (hasBoolHeight) {
            if (sReq.returnOpeningHeightGt28m === false) {
              return {
                ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
                reasons: ['Section 6.2.1.2.1 violation: return opening height is not greater than 2.8 m above floor.']
              };
            }
            returnOpeningConditionMet = true;
          }

          // Check mechanical mixing devices
          if (sReq.noMechanicalMixingDevices === false) {
            return {
              ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
              reasons: ['Section 6.2.1.2.1 violation: mechanical mixing devices are present in the space.']
            };
          }

          // Check protection from impinging airstreams
          if (sReq.protectedFromImpingingAirstreams === false) {
            return {
              ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
              reasons: ['Section 6.2.1.2.1 violation: stratified zone is not protected from impinging airstreams.']
            };
          }

          // Contradiction with compact representation stratifiedPrerequisitesMet if provided
          if (criteria.stratifiedPrerequisitesMet === false) {
            return {
              ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
              reasons: ['Contradictory stratified prerequisites: structured prerequisites provided but stratifiedPrerequisitesMet is false.']
            };
          }

          // Check for any missing conditions in structured prerequisites
          if (supplyTempConditionMet === null) {
            return {
              ezConfig: null, selectedConfig: null, ez: null, status: 'INCOMPLETE',
              reasons: ['Stratified system prerequisite missing: supply air temperature difference must be verified (at least 2°C below room temperature).']
            };
          }

          if (returnOpeningConditionMet === null) {
            return {
              ezConfig: null, selectedConfig: null, ez: null, status: 'INCOMPLETE',
              reasons: ['Stratified system prerequisite missing: return opening height must be verified (> 2.8 m above floor).']
            };
          }

          if (sReq.noMechanicalMixingDevices !== true) {
            return {
              ezConfig: null, selectedConfig: null, ez: null, status: 'INCOMPLETE',
              reasons: ['Stratified system prerequisite missing: must verify no mechanical mixing devices are present.']
            };
          }

          if (sReq.protectedFromImpingingAirstreams !== true) {
            return {
              ezConfig: null, selectedConfig: null, ez: null, status: 'INCOMPLETE',
              reasons: ['Stratified system prerequisite missing: must verify protection from impinging airstreams from adjacent zones.']
            };
          }
        } else if (criteria.stratifiedPrerequisitesMet === false) {
          return {
            ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
            reasons: ['Stratified system prerequisites under Section 6.2.1.2.1 not satisfied.']
          };
        } else if (criteria.stratifiedPrerequisitesMet !== true) {
          return {
            ezConfig: null, selectedConfig: null, ez: null, status: 'INCOMPLETE',
            reasons: ['Stratified system prerequisites under ASHRAE 62.1-2022 Section 6.2.1.2.1 must be verified (supply temp at least 2°C below room, return height > 2.8 m, no mechanical mixing, protected from impinging airstreams).']
          };
        }

        // Validate return height and detect contradictions between numeric and boolean representations
        const hasNumericReturnHeight = typeof criteria.returnHeightM === 'number';
        const hasBoolGt55 = typeof criteria.returnHeightGt55m === 'boolean';
        const hasBoolGte55 = typeof criteria.returnHeightGte55m === 'boolean';

        // Check contradiction between boolean flags if both provided
        if (hasBoolGt55 && hasBoolGte55 && criteria.returnHeightGt55m !== criteria.returnHeightGte55m) {
          return {
            ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
            reasons: ['Contradictory return height criteria: returnHeightGt55m does not match returnHeightGte55m.']
          };
        }

        const boolReturnGt55 = hasBoolGt55 ? criteria.returnHeightGt55m! : (hasBoolGte55 ? criteria.returnHeightGte55m! : null);

        let isReturnGt55m: boolean | null = null;
        if (hasNumericReturnHeight && boolReturnGt55 !== null) {
          const numericGt55 = (criteria.returnHeightM as number) > 5.5;
          if (numericGt55 !== boolReturnGt55) {
            return {
              ezConfig: null, selectedConfig: null, ez: null, status: 'FAIL',
              reasons: [`Contradictory return height criteria: returnHeightM (${criteria.returnHeightM} m) ${numericGt55 ? '> 5.5 m' : '<= 5.5 m'} contradicts boolean indicator (${boolReturnGt55}).`]
            };
          }
          isReturnGt55m = numericGt55;
        } else if (hasNumericReturnHeight) {
          isReturnGt55m = (criteria.returnHeightM as number) > 5.5;
        } else if (boolReturnGt55 !== null) {
          isReturnGt55m = boolReturnGt55;
        }

        if (criteria.verticalThrowMet === null || criteria.verticalThrowMet === undefined) {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'INCOMPLETE',
            reasons: ['Missing vertical throw condition (requires throw velocity >= 0.25 m/s or < 0.25 m/s at 1.4 m)']
          };
        }

        if (isReturnGt55m === null) {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'INCOMPLETE',
            reasons: ['Missing return height condition (requires return height <= 5.5 m or > 5.5 m)']
          };
        }

        // Case 1: vertical throw >= 0.25 m/s (60 fpm) at 1.4 m and ceiling return <= 5.5 m (18 ft) -> Ez = 1.05
        if (criteria.verticalThrowMet && !isReturnGt55m) {
          const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-floor-cool-strat-case1')!;
          return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
        }

        // Case 2: vertical throw < 0.25 m/s (60 fpm) at 1.4 m and ceiling return <= 5.5 m (18 ft) -> Ez = 1.2
        if (!criteria.verticalThrowMet && !isReturnGt55m) {
          const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-3')!;
          return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
        }

        // Case 3: vertical throw < 0.25 m/s (60 fpm) at 1.4 m and ceiling return > 5.5 m (18 ft) -> Ez = 1.5
        if (!criteria.verticalThrowMet && isReturnGt55m) {
          const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-floor-cool-strat-h-gte55m')!;
          return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
        }

        // Vertical throw >= 0.25 m/s with return height > 5.5 m is not defined by Table 6-4
        return {
          ezConfig: null,
          selectedConfig: null,
          ez: null,
          status: 'INCOMPLETE',
          reasons: ['Table 6-4 does not specify an Ez value for vertical throw >= 0.25 m/s with return height > 5.5 m. Engineering analysis required.']
        };
      }
    }

    return {
      ezConfig: null,
      selectedConfig: null,
      ez: null,
      status: 'INCOMPLETE',
      reasons: ['Invalid supply configuration or unmatched Table 6-4 condition']
    };
  }

  /**
   * Validates an existing Ez configuration and its associated operating conditions.
   */
  static validateEzConfiguration(ezConfig: Ashrae621Ez | null, conditions?: EzValidationConditions): { valid: boolean; status: ValidationStatus; reasons: string[] } {
    if (!ezConfig) {
      return { valid: false, status: 'INCOMPLETE', reasons: ['Missing Ez configuration'] };
    }

    if (ezConfig.verificationStatus === 'UNIMPLEMENTED') {
      return { valid: false, status: 'BLOCKED', reasons: ['Unimplemented Table 6-4 Configuration'] };
    }

    if (ezConfig.verificationStatus === 'NOT_VERIFIED' || ezConfig.id === 'ez-unidirectional-flow' || ezConfig.distributionCategory === 'unidirectional') {
      return { valid: false, status: 'BLOCKED', reasons: ['Unverified / non-production Table 6-4 Configuration (ez-unidirectional-flow is NOT_VERIFIED)'] };
    }

    if (ezConfig.verificationStatus === 'INVALID') {
      return { valid: false, status: 'FAIL', reasons: ['Invalid Ez configuration'] };
    }

    if (ezConfig.ez === null || isNaN(ezConfig.ez) || ezConfig.ez <= 0 || !isFinite(ezConfig.ez)) {
      return { valid: false, status: 'FAIL', reasons: ['Invalid Ez'] };
    }

    if (ezConfig.isManualOverride) {
      if (!ezConfig.manualOverrideBasis && !ezConfig.manualJustification) {
        return { valid: false, status: 'INCOMPLETE', reasons: ['Missing engineering justification for Ez manual override'] };
      }
      return { valid: true, status: 'NOT_VERIFIED', reasons: ['Manual Engineering Override - Non-standard basis'] };
    }

    // Check configuration conditional requirements if conditions object is explicitly provided
    if (conditions) {
      if (ezConfig.supplyAirCondition === 'cool' && conditions.supplyTempRelationship && conditions.supplyTempRelationship !== 'cooling') {
        return { valid: false, status: 'FAIL', reasons: ['Configuration requires cooling supply air'] };
      }
      if (ezConfig.supplyAirCondition === 'warm' && conditions.supplyTempRelationship && conditions.supplyTempRelationship === 'cooling') {
        return { valid: false, status: 'FAIL', reasons: ['Configuration requires heating supply air'] };
      }

      // Stratified cooling requires vertical throw and return height
      if (ezConfig.id === 'ez-3' || ezConfig.id === 'ez-floor-cool-strat-h-gte55m' || ezConfig.id === 'ez-floor-cool-strat-case1') {
        if (conditions.verticalThrowMet === null || conditions.verticalThrowMet === undefined) {
          return { valid: false, status: 'INCOMPLETE', reasons: ['Missing vertical throw'] };
        }
        if (conditions.returnHeightGte55m === null || conditions.returnHeightGte55m === undefined) {
          return { valid: false, status: 'INCOMPLETE', reasons: ['Missing return height'] };
        }
      }

      // Warm ceiling supply with ceiling return requires temperature relationship
      if (ezConfig.id === 'ez-2' || ezConfig.id === 'ez-ceil-warm-lt8c-highvel' || ezConfig.id === 'ez-ceil-warm-lt8c-lowvel') {
        if (conditions.supplyTempRelationship === null || conditions.supplyTempRelationship === undefined) {
          return { valid: false, status: 'INCOMPLETE', reasons: ['Missing supply temperature relationship'] };
        }
      }

      // Low diff ceiling supply requires jet velocity condition
      if (ezConfig.id === 'ez-ceil-warm-lt8c-highvel' || ezConfig.id === 'ez-ceil-warm-lt8c-lowvel') {
        if (conditions.supplyJetVelocityMet === null || conditions.supplyJetVelocityMet === undefined) {
          return { valid: false, status: 'INCOMPLETE', reasons: ['Missing supply jet velocity condition'] };
        }
      }
    }

    return { valid: true, status: 'PASS', reasons: [] };
  }
}
