import { VentilationSpaceType } from '../../models/VentilationModels';
import { ASHRAE_62_1_2022_SPACES, ASHRAE_62_1_2019_SPACES, ASHRAE_62_1_2025_SPACES } from '../data/ashrae621/SpaceTypes';
import { AirDistributionConfiguration, ASHRAE_62_1_2019_EZ, ASHRAE_62_1_2022_EZ, ASHRAE_62_1_2025_EZ } from '../data/ashrae621/AirDistributionData';
import { SystemOutdoorAirRequirements, ZoneVentilationData } from '../../models/VentilationModels';

export interface ZoneVentilationInput {
  spaceType: VentilationSpaceType;
  area: number; // m2 or ft2 (must match spaceType metrics)
  designOccupancy: number;
  useDefaultOccupancy: boolean;
  ezConfig: AirDistributionConfiguration;
  isMetric: boolean;
  densityRatio?: number;
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
  vozActual?: number;
}

export class Ashrae621Service {
  

  /**
   * Applies density ratio to convert standard flow to actual volumetric flow.
   * Q_actual = Q_standard / densityRatio
   */
  static applyDensityCorrection(standardFlow: number, densityRatio: number): number {
    if (!densityRatio || densityRatio <= 0) return standardFlow;
    return standardFlow / densityRatio;
  }

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
    const { spaceType, area, designOccupancy, useDefaultOccupancy, ezConfig, isMetric, densityRatio = 1.0 } = input;

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
    const vozActual = Ashrae621Service.applyDensityCorrection(voz, densityRatio);

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
      occupancySource,
      vozActual
    };
  }



  /**
   * Calculates ASHRAE 62.1 multi-zone system outdoor air requirements.
   * Section 6.2.5 Multiple Zone Recirculating Systems.
   */
  static calculateSystemVentilation(systemId: string, zones: ZoneVentilationData[], densityRatio: number = 1.0): SystemOutdoorAirRequirements {
    let vou = 0;
    let vps = 0;
    let maxZp = 0;

    for (const zone of zones) {
      vou += zone.voz;
      if (zone.vpz && zone.vpz > 0) {
        vps += zone.vpz;
        const zp = zone.voz / zone.vpz;
        if (zp > maxZp) {
          maxZp = zp;
        }
      }
    }

    const xs = vps > 0 ? vou / vps : 0;
    const zd = maxZp;

    // Calculate exact Evz for each zone (Full Normative Appendix A)
    let ev = 1.0;
    for (const zone of zones) {
      if (zone.vpz && zone.vpz > 0) {
        const zp = zone.voz / zone.vpz;
        const ep = zone.ep ?? 1.0;
        const er = zone.er ?? 0.0;
        const ez = zone.ez ?? 1.0;
        
        const fa = ep + (1 - ep) * er;
        const fb = ep;
        const fc = 1 - (1 - ez) * (1 - er) * (1 - ep);
        
        const evz = fa > 0 ? (fa + xs * fb - zp * ep * fc) / fa : 1.0;
        
        if (evz < ev) {
          ev = evz;
        }
      }
    }
    // Ev theoretically shouldn't exceed 1.0 or drop below a practical minimum (e.g., 0.1)
    ev = Math.max(0.1, Math.min(1.0, ev));

    const vot = ev > 0 ? vou / ev : 0;
    const votActual = Ashrae621Service.applyDensityCorrection(vot, densityRatio);

    return {
      systemId,
      systemType: 'multi',
      vps,
      vou,
      xs,
      zd,
      ev,
      vot,
      votActual
    };
  }
}
