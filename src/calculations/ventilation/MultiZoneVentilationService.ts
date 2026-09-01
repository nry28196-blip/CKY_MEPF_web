import { ZoneVentilationResult, Ashrae621Service } from './Ashrae621Service';

export interface MultiZoneInput {
  zoneId: string;
  name: string;
  zoneResult: ZoneVentilationResult;
  primaryAirflow: number; // Vpz (Zone Primary Airflow)
  ep?: number; // Primary air fraction (Ep)
  er?: number; // Secondary recirculation fraction (Er)
}

export interface MultiZoneSystemResult {
  sumVbz: number; // Sum of all Vbz
  sumVoz: number; // Sum of all Voz
  sumVpz: number; // Sum of all Vpz (Primary air to all zones)
  ps: number; // System Population
  xs: number; // Uncorrected System Outdoor Air Fraction (Sum(Voz) / Sum(Vpz))
  zdMax: number; // Maximum Zone Outdoor Air Fraction (Max(Zpz))
  ev: number; // System Ventilation Efficiency
  vou: number; // Uncorrected Outdoor Air Intake
  vot: number; // Required System Outdoor Air Intake
  votActual: number; // Density Corrected
  criticalZoneId: string;
  zones: {
    zoneId: string;
    zpz: number; // Zone Outdoor Air Fraction (Voz / Vpz)
    isCritical: boolean;
  }[];
}

export class MultiZoneVentilationService {
  /**
   * Calculates the multi-zone AHU outdoor air requirement per ASHRAE 62.1 (Simplified/Primary method).
   * Note: This represents the standard 62.1-2019/2022 calculation for a multi-zone VAV/CV system.
   */
  static calculateMultiZoneSystem(zones: MultiZoneInput[], populationDiversity: number = 1.0, densityRatio: number = 1.0): MultiZoneSystemResult {
    let sumVbz = 0;
    let sumVoz = 0;
    let sumVpz = 0;
    let sumPz = 0;
    
    // Calculate totals
    zones.forEach(z => {
      sumVbz += z.zoneResult.vbz;
      sumVoz += z.zoneResult.voz;
      sumVpz += z.primaryAirflow;
      sumPz += z.zoneResult.pz;
    });

    const ps = sumPz * populationDiversity; // System population

    let zdMax = 0;
    let criticalZoneId = '';
    const zoneResults = [];

    // Find critical zone (max Zpz)
    zones.forEach(z => {
      const zpz = z.primaryAirflow > 0 ? z.zoneResult.voz / z.primaryAirflow : 0;
      if (zpz > zdMax) {
        zdMax = zpz;
        criticalZoneId = z.zoneId;
      }
      zoneResults.push({
        zoneId: z.zoneId,
        zpz,
        isCritical: false
      });
    });

    // Mark critical zone
    zoneResults.forEach(zr => {
      if (zr.zoneId === criticalZoneId) {
        zr.isCritical = true;
      }
    });

    // Uncorrected System Outdoor Air Intake (Vou)
    // D is Occupant Diversity = Ps / Sum(Pz)
    const d = sumPz > 0 ? ps / sumPz : 1;
    let vou = 0;
    
    // Vou = D * Sum(Rp * Pz) + Sum(Ra * Az) 
    // This is equivalent to D * Sum(Vbp) + Sum(Vba) for all zones, BUT we need to account for Ez at the zone level
    // Wait, ASHRAE 62.1-2019 6.2.5.2:
    // Vou = D * Sum(Rp * Pz) + Sum(Ra * Az) 
    
    let sumRpPz = 0;
    let sumRaAz = 0;
    zones.forEach(z => {
      sumRpPz += z.zoneResult.vbp;
      sumRaAz += z.zoneResult.vba;
    });
    
    vou = (d * sumRpPz) + sumRaAz;

    
    // System Primary Fraction (Xs)
    const xs = sumVpz > 0 ? vou / sumVpz : 0;

    // System Ventilation Efficiency (Ev)
    // #1 Fix: Exact applicable 62.1 procedure (Normative Appendix A)
    // Ev = 1 + Xs - Zd (for systems with no secondary recirculation)
    // We will calculate Evz for each zone and take the minimum to be fully exact.
    
    let ev = 1.0;
    
    // Calculate exact Evz for each zone using Full Normative Appendix A
    zoneResults.forEach(zr => {
       const zoneInput = zones.find(z => z.zoneId === zr.zoneId);
       const ep = zoneInput?.ep ?? 1.0;
       const er = zoneInput?.er ?? 0.0;
       const ez = zoneInput?.zoneResult.ez ?? 1.0;
       
       const fa = ep + (1 - ep) * er;
       const fb = ep;
       const fc = 1 - (1 - ez) * (1 - er) * (1 - ep);
       
       const evz = fa > 0 ? (fa + xs * fb - zr.zpz * ep * fc) / fa : 1.0;
       
       if (evz < ev) {
          ev = evz;
       }
    });
    
    // Ev cannot be greater than 1.0 or less than 0.1 theoretically
    ev = Math.max(0.1, Math.min(1.0, ev));

    // Required System Outdoor Air Intake (Vot)
    const vot = ev > 0 ? vou / ev : 0;
    const votActual = Ashrae621Service.applyDensityCorrection(vot, densityRatio);

    return {
      sumVbz,
      sumVoz,
      sumVpz,
      ps,
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
