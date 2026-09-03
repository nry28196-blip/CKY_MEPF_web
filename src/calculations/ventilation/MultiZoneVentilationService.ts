import { ZoneVentilationResult, Ashrae621Service } from './Ashrae621Service';

export interface MultiZoneInput {
  zoneId: string;
  name: string;
  zoneResult: ZoneVentilationResult;
  primaryAirflow: number; // Vpz (Zone Primary Airflow at design)
  vpzMin?: number; // Vpz-min (Zone minimum primary airflow). Defaults to primaryAirflow.
  ep?: number; // Primary air fraction (Ep)
  er?: number; // Secondary recirculation fraction (Er)
}

export interface MultiZoneSystemResult {
  sumVbz: number; // Sum of all Vbz
  sumVoz: number; // Sum of all Voz
  sumVpz: number; // Sum of all Vpz (Primary air to all zones)
  sumVpzMin: number; // Sum of all Vpz-min
  sumPz: number; // Sum of zone peak populations
  ps: number; // Peak System Population
  vps: number; // System Primary Airflow
  d: number; // Occupant Diversity Ratio (Ps / SumPz)
  xs: number; // Uncorrected System Outdoor Air Fraction (Vou / Vps)
  zdMax: number; // Maximum Zone Outdoor Air Fraction (Max(Zpz))
  ev: number; // System Ventilation Efficiency
  vou: number; // Uncorrected Outdoor Air Intake
  vot: number; // Required System Outdoor Air Intake
  votActual: number; // Density Corrected
  criticalZoneId: string;
  zones: {
    zoneId: string;
    zpz: number; // Zone Outdoor Air Fraction (Voz / Vpz-min)
    evz: number; // Zone Ventilation Efficiency
    isCritical: boolean;
    vpzMin: number;
    voz: number;
  }[];
}

export class MultiZoneVentilationService {
  /**
   * Calculates the multi-zone AHU outdoor air requirement per ASHRAE 62.1 (Simplified/Primary method).
   * Supports both VAV and CV multi-zone systems.
   */
  static calculateMultiZoneSystem(
    zones: MultiZoneInput[], 
    systemPopulation: number | null = null, 
    vpsInput: number | null = null,
    densityRatio: number = 1.0
  ): MultiZoneSystemResult {
    let sumVbz = 0;
    let sumVoz = 0;
    let sumVpz = 0;
    let sumVpzMin = 0;
    let sumPz = 0;
    let sumRpPz = 0;
    let sumRaAz = 0;
    
    // Calculate totals
    zones.forEach(z => {
      sumVbz += z.zoneResult.vbz;
      sumVoz += z.zoneResult.voz;
      sumVpz += z.primaryAirflow;
      // If Vpz-min is not provided, default to Vpz (assumes Constant Volume). Do not use an arbitrary 30% VAV rule.
      const derivedVpzMin = (z.vpzMin !== undefined && z.vpzMin !== null) 
        ? Number(z.vpzMin) 
        : z.primaryAirflow;
      sumVpzMin += derivedVpzMin;
      sumPz += z.zoneResult.pz;
      sumRpPz += z.zoneResult.vbp;
      sumRaAz += z.zoneResult.vba;
    });

    // 1. System Population (Ps)
    // If not explicitly provided, Ps = sum of all Pz (Diversity = 1.0)
    const ps = (systemPopulation !== null && systemPopulation >= 0) ? systemPopulation : sumPz;

    // 2. Occupant Diversity (D)
    // D = Ps / Sum(Pz)
    const d = sumPz > 0 ? ps / sumPz : 1;
    
    // 3. Uncorrected Outdoor Air Intake (Vou)
    // Vou = D * Sum(Rp * Pz) + Sum(Ra * Az) 
    const vou = (d * sumRpPz) + sumRaAz;

    // 4. System Primary Airflow (Vps)
    // For VAV, Vps is the minimum expected primary airflow. 
    // If not explicitly provided, we assume it's the sum of Vpz-min for a conservative estimate.
    const vps = (vpsInput !== null && vpsInput > 0) ? vpsInput : sumVpzMin;

    // 5. System Primary Fraction (Xs)
    // Xs = Vou / Vps
    const xs = vps > 0 ? vou / vps : 0;

    // Find critical zone (max Zpz) and exact Evz for each zone
    let zdMax = 0;
    let ev = Infinity;
    let criticalZoneId = '';
    const zoneResults: any[] = [];

    zones.forEach(z => {
      const vpzMin = (z.vpzMin !== undefined && z.vpzMin !== null) 
        ? Number(z.vpzMin) 
        : z.primaryAirflow;
      
      // Zpz = Voz / Vpz-min. If vpzMin is 0, Zpz is Infinity (highly critical)
      const zpz = vpzMin > 0 ? z.zoneResult.voz / vpzMin : Infinity;
      
      if (zpz > zdMax) {
        zdMax = zpz;
      }
      
      // Calculate exact Evz for each zone using Full Normative Appendix A
      const ep = z.ep ?? 1.0;
      const er = z.er ?? 0.0;
      const ez = z.zoneResult.ez ?? 1.0;
      
      const fa = ep + (1 - ep) * er;
      const fb = ep;
      const fc = 1 - (1 - ez) * (1 - er) * (1 - ep);
      
      const evz = fa > 0 ? (fa + xs * fb - zpz * ep * fc) / fa : 1.0;
      
      if (evz < ev) {
        ev = evz;
        criticalZoneId = z.zoneId;
      }
      
      zoneResults.push({
        zoneId: z.zoneId,
        zpz,
        evz,
        isCritical: false,
        vpzMin,
        voz: z.zoneResult.voz
      });
    });

    // Mark critical zone
    zoneResults.forEach(zr => {
      if (zr.zoneId === criticalZoneId) {
        zr.isCritical = true;
      }
    });

    // Ev cannot be theoretically greater than 1.0 or less than 0.1
    ev = Math.max(0.1, Math.min(1.0, ev));

    // Required System Outdoor Air Intake (Vot)
    const vot = ev > 0 ? vou / ev : 0;
    const votActual = Ashrae621Service.applyDensityCorrection(vot, densityRatio);

    return {
      sumVbz,
      sumVoz,
      sumVpz,
      sumVpzMin,
      sumPz,
      ps,
      vps,
      d,
      xs,
      zdMax,
      ev,
      vou,
      vot,
      votActual,
      criticalZoneId,
      zones: zoneResults
    };
  }
}
