import { VentilationSpaceType } from '../../models/VentilationModels';
import { ASHRAE_62_1_2022_SPACES, ASHRAE_62_1_2019_SPACES, ASHRAE_62_1_2025_SPACES } from '../data/ashrae621/SpaceTypes';
import { AirDistributionConfiguration } from '../data/ashrae621/AirDistributionData';

export interface ZoneVentilationInput {
  spaceType: VentilationSpaceType;
  area: number; // m2 or ft2 (must match spaceType metrics)
  designOccupancy: number;
  useDefaultOccupancy: boolean;
  ezConfig: AirDistributionConfiguration;
  isMetric: boolean;
}

export interface ZoneVentilationResult {
  az: number;
  pz: number;
  rp: number;
  ra: number;
  vbp: number; // Breathing zone outdoor airflow (people component)
  vba: number; // Breathing zone outdoor airflow (area component)
  vbz: number; // Total breathing zone outdoor airflow
  ez: number;
  voz: number; // Zone outdoor airflow
  occupancyUsed: number;
  occupancySource: 'design' | 'default';
}

export class Ashrae621Service {
  /**
   * Retrieves space types based on the selected ASHRAE 62.1 edition.
   */
  static getSpacesByEdition(edition: '2019' | '2022' | '2025'): VentilationSpaceType[] {
    if (edition === '2019') return ASHRAE_62_1_2019_SPACES;
    if (edition === '2025') return ASHRAE_62_1_2025_SPACES;
    return ASHRAE_62_1_2022_SPACES;
  }

  static calculateZoneVentilation(input: ZoneVentilationInput): ZoneVentilationResult {
    const { spaceType, area, designOccupancy, useDefaultOccupancy, ezConfig, isMetric } = input;

    // 1. Determine Rp and Ra
    const rp = isMetric ? (spaceType.rpMetric || 0) : (spaceType.rpImp || 0);
    const ra = isMetric ? (spaceType.raMetric || 0) : (spaceType.raImp || 0);

    // 2. Determine Occupancy (Pz)
    let pz = designOccupancy;
    let occupancySource: 'design' | 'default' = 'design';
    
    if (useDefaultOccupancy) {
      const defaultDensity = isMetric ? (spaceType.defaultOccupancyMetric || 0) : (spaceType.defaultOccupancyImp || 0);
      const densityDivisor = isMetric ? 100 : 1000;
      pz = (area / densityDivisor) * defaultDensity;
      occupancySource = 'default';
    }

    // 3. Calculate Vbz components
    const vbp = rp * pz;
    const vba = ra * area;
    // Vbz = Rp*Pz + Ra*Az calculation
    const vbz = vbp + vba;

    // 4. Determine Ez
    const ez = ezConfig.ez;

    // 5. Calculate Voz
    // Voz = Vbz / Ez
    const voz = ez > 0 ? vbz / ez : 0;

    return {
      az: area,
      pz,
      rp,
      ra,
      vbp,
      vba,
      vbz,
      ez,
      voz,
      occupancyUsed: pz,
      occupancySource
    };
  }
}
