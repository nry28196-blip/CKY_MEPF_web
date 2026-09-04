import { VentilationSpaceType } from '../../models/VentilationModels';
import { ASHRAE_62_1_2022_SPACES, ASHRAE_62_1_2019_SPACES, ASHRAE_62_1_2025_SPACES } from '../data/ashrae621/SpaceTypes';
import { AirDistributionConfiguration, ASHRAE_62_1_2019_EZ, ASHRAE_62_1_2022_EZ, ASHRAE_62_1_2025_EZ } from '../data/ashrae621/AirDistributionData';
import { Ashrae621ZoneService, ZoneVentilationInput as NewZoneVentilationInput, ZoneVentilationResult as NewZoneVentilationResult } from './Ashrae621ZoneService';
import { UnitConversionService } from '../services/UnitConversionService';

export interface ZoneVentilationInput extends NewZoneVentilationInput {
  isMetric: boolean;
}

export interface ZoneVentilationResult extends NewZoneVentilationResult {
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
    // 1. Convert Imperial inputs to Metric (canonical)
    const canonicalArea = input.isMetric ? input.area : UnitConversionService.sqftToSqM(input.area);

    const canonicalInput: NewZoneVentilationInput = {
      spaceType: input.spaceType,
      area: canonicalArea,
      designOccupancy: input.designOccupancy,
      useDefaultOccupancy: input.useDefaultOccupancy,
      ezConfig: input.ezConfig
    };

    // 2. Perform canonical metric calculation
    const res = Ashrae621ZoneService.calculateZoneVentilation(canonicalInput);

    // 3. Convert outputs back to Imperial if needed (UI boundary)
    if (!input.isMetric) {
      return {
        ...res,
        az: UnitConversionService.sqMToSqft(res.az),
        rp: UnitConversionService.lsToCfm(res.rp),
        ra: UnitConversionService.lsToCfm(res.ra) * 0.092903, // L/s-m2 -> cfm/ft2  Wait: L/s to cfm = /0.4719. per m2 to per ft2 = *0.0929.
        vbp: UnitConversionService.lsToCfm(res.vbp),
        vba: UnitConversionService.lsToCfm(res.vba),
        vbz: UnitConversionService.lsToCfm(res.vbz),
        voz: UnitConversionService.lsToCfm(res.voz)
      };
    }

    return res;
  }
}
