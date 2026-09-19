import { Ashrae621Ez, SourceType } from '../../data/ventilation/ashrae621/types';
import { ASHRAE_621_2022_EZ_VALUES } from '../../data/ventilation/ashrae621/2022/data';
import { ValidationStatus } from './VentilationValidationService';

export interface EzSelectionCriteria {
  distributionCategory?: 'ceiling' | 'floor' | 'makeup' | 'personalized' | 'unidirectional' | 'override';
  supplyLocation?: 'ceiling' | 'floor' | 'breathing_zone' | 'other';
  returnLocation?: 'ceiling' | 'floor' | 'other';
  supplyAirCondition?: 'cool' | 'warm' | 'isothermal' | 'any';
  spaceTempRelationship?: 'cooling' | 'heating_gte_8c' | 'heating_lt_8c' | 'none' | null;
  supplyTempRelationship?: 'cooling' | 'heating_gte_8c' | 'heating_lt_8c' | 'none' | null;
  supplyJetVelocityMet?: boolean | null; // true if supply jet velocity >= 0.8 m/s (150 fpm) within 1.4 m of floor
  verticalThrowMet?: boolean | null; // true if throw of 0.25 m/s <= 1.4 m (displacement / stratified)
  returnHeightGte55m?: boolean | null; // true if return height >= 5.5 m (18 ft)
  isDirectMakeupExhaust?: boolean;
  isPersonalizedVentilation?: boolean;
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
   * Retrieves all verified Table 6-4 records for the 2022 standard edition.
   */
  static getTable64Values(): Ashrae621Ez[] {
    return ASHRAE_621_2022_EZ_VALUES;
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

    // Determine supply air condition and temperature relationship
    let supplyAirCondition = criteria.supplyAirCondition;
    let spaceTempRelationship = criteria.spaceTempRelationship || criteria.supplyTempRelationship;
    if (!supplyAirCondition && spaceTempRelationship) {
      if (spaceTempRelationship === 'cooling') supplyAirCondition = 'cool';
      else if (spaceTempRelationship === 'heating_gte_8c' || spaceTempRelationship === 'heating_lt_8c') supplyAirCondition = 'warm';
    }

    // 2. Personalized ventilation
    if (criteria.isPersonalizedVentilation || criteria.supplyLocation === 'breathing_zone') {
      const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-personalized-ventilation')!;
      return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
    }

    // 3. Direct makeup exhaust
    if (criteria.isDirectMakeupExhaust || criteria.returnLocation === 'other') {
      const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-makeup-direct-exhaust')!;
      return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
    }

    // 4. Ceiling supply configurations
    if (criteria.supplyLocation === 'ceiling') {
      // 4a. Ceiling supply of cool air
      if (supplyAirCondition === 'cool' || spaceTempRelationship === 'cooling') {
        const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-1')!;
        return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
      }

      // 4b. Ceiling supply of warm air
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

    // 5. Floor supply configurations
    if (criteria.supplyLocation === 'floor') {
      // 5a. Floor supply of warm air
      if (supplyAirCondition === 'warm' || spaceTempRelationship === 'heating_gte_8c' || spaceTempRelationship === 'heating_lt_8c') {
        if (criteria.returnLocation === 'floor') {
          const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-floor-warm-floor-ret')!;
          return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
        }
        if (criteria.returnLocation === 'ceiling') {
          const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-floor-warm-ceil-ret')!;
          return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
        }
      }

      // 5b. Floor supply of cool air and ceiling return
      if ((supplyAirCondition === 'cool' || spaceTempRelationship === 'cooling') && criteria.returnLocation === 'ceiling') {
        if (criteria.verticalThrowMet === null || criteria.verticalThrowMet === undefined) {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'INCOMPLETE',
            reasons: ['Missing vertical throw']
          };
        }

        // If vertical throw is > 1.4 m (well-mixed)
        if (criteria.verticalThrowMet) {
          const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-4')!;
          return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
        }

        // Low-velocity displacement ventilation (stratified) requires return height
        if (criteria.returnHeightGte55m === null || criteria.returnHeightGte55m === undefined) {
          return {
            ezConfig: null,
            selectedConfig: null,
            ez: null,
            status: 'INCOMPLETE',
            reasons: ['Missing return height']
          };
        }

        if (criteria.returnHeightGte55m) {
          const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-floor-cool-strat-h-gte55m')!;
          return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
        } else {
          const config = ASHRAE_621_2022_EZ_VALUES.find(e => e.id === 'ez-3')!;
          return { ezConfig: config, selectedConfig: config, ez: config.ez, status: 'PASS', reasons: [] };
        }
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

      // Stratified displacement requires vertical throw
      if (ezConfig.id === 'ez-3' || ezConfig.id === 'ez-floor-cool-strat-h-gte55m') {
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
