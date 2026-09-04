import { VentilationSpaceType } from '../../models/VentilationModels';
import { ASHRAE_62_1_2022_SPACES, ASHRAE_62_1_2019_SPACES, ASHRAE_62_1_2025_SPACES } from '../data/ashrae621/SpaceTypes';
import { AirDistributionConfiguration, ASHRAE_62_1_2019_EZ, ASHRAE_62_1_2022_EZ, ASHRAE_62_1_2025_EZ } from '../data/ashrae621/AirDistributionData';
import { SystemOutdoorAirRequirements, ZoneVentilationData } from '../../models/VentilationModels';
import { AirDensityService } from '../services/AirDensityService';
import { Ashrae621ZoneService, ZoneVentilationInput as NewZoneVentilationInput, ZoneVentilationResult as NewZoneVentilationResult } from './Ashrae621ZoneService';

export interface ZoneVentilationInput extends NewZoneVentilationInput {
  isMetric: boolean;
  densityRatio?: number;
}

export interface ZoneVentilationResult extends NewZoneVentilationResult {
  vozActual?: number;
}

export class Ashrae621Service {
  static getSpacesByEdition(edition: '2019' | '2022' | '2025'): VentilationSpaceType[] {
    if (edition === '2019') return ASHRAE_62_1_2019_SPACES;
    if (edition === '2025') return ASHRAE_62_1_2025_SPACES;
    return ASHRAE_62_1_2022_SPACES;
  }

  static getEzByEdition(edition: '2019' | '2022' | '2025'): AirDistributionConfiguration[] {
    if (edition === '2019') return ASHRAE_62_1_2019_EZ;
    if (edition === '2025') return ASHRAE_62_1_2025_EZ;
    return ASHRAE_62_1_2022_EZ;
  }

  static calculateZoneVentilation(input: ZoneVentilationInput): ZoneVentilationResult {
    const res = Ashrae621ZoneService.calculateZoneVentilation(input);
    const vozActual = AirDensityService.applyDensityCorrection(res.voz, input.densityRatio || 1.0);
    return {
      ...res,
      vozActual
    };
  }
}
