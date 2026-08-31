import { ZoneVentilationResult } from './Ashrae621Service';

export interface MultiZoneInput {
  zoneId: string;
  name: string;
  zoneResult: ZoneVentilationResult;
  primaryAirflow: number; // Vpz (Zone Primary Airflow)
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
  static calculateMultiZoneSystem(zones: MultiZoneInput[], populationDiversity: number = 1.0): MultiZoneSystemResult {
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
    // Simplified table or calculation. ASHRAE 62.1 Table 6.2.5.2
    // Or Appendix A exact calculation. We will use the simplified Appendix A formula Ev = 1 + Xs - Zd
    // Standard table lookup:
    let ev = 1.0;
    if (zdMax <= 0.15) ev = 1.0;
    else if (zdMax <= 0.25) ev = 0.9;
    else if (zdMax <= 0.35) ev = 0.8;
    else if (zdMax <= 0.45) ev = 0.7;
    else if (zdMax <= 0.55) ev = 0.6;
    else if (zdMax <= 0.65) ev = 0.5;
    else if (zdMax <= 0.75) ev = 0.4;
    else {
      // If Zd > 0.75, standard Ev table doesn't apply well, usually Ev is lower or use exact Appendix A
      // We'll approximate using the formula from App A if needed, or bound at 0.3
      ev = 0.3;
    }

    // Required System Outdoor Air Intake (Vot)
    const vot = ev > 0 ? vou / ev : 0;

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
      criticalZoneId,
      zones: zoneResults
    };
  }
}
