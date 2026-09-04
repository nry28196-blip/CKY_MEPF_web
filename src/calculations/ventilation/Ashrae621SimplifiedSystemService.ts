import { ZoneVentilationResult } from './Ashrae621ZoneService';

export interface SimplifiedZoneInput {
  zoneResult: ZoneVentilationResult;
  vpz: number;
}

export interface SimplifiedSystemInput {
  zones: SimplifiedZoneInput[];
  systemPopulation?: number | null; // Ps
}

export interface SimplifiedSystemResult {
  ps: number;
  sumPz: number;
  d: number;
  sumRpPz: number;
  sumRaAz: number;
  vou: number;
  maxZpz: number;
  ev: number;
  vot: number;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE';
  warning?: string;
  error?: string;
}

export class Ashrae621SimplifiedSystemService {
  static getEvFromMaxZpz(maxZpz: number): number {
    if (maxZpz <= 0.15) return 0.88;
    if (maxZpz <= 0.25) return 0.75;
    if (maxZpz <= 0.35) return 0.65;
    if (maxZpz <= 0.45) return 0.55;
    if (maxZpz <= 0.55) return 0.50;
    if (maxZpz <= 0.65) return 0.45;
    if (maxZpz <= 0.75) return 0.40;
    return 0.30; // Usually >0.75 means must use Appendix A, so this is a failure/warning state
  }

  static calculate(input: SimplifiedSystemInput): SimplifiedSystemResult {
    let status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE' = 'PASS';
    let warning = undefined;
    let error = undefined;
    
    if (!input.zones || input.zones.length === 0) {
      return this.emptyResult('INCOMPLETE', 'No zones provided');
    }

    let sumPz = 0;
    let sumRpPz = 0;
    let sumRaAz = 0;
    let maxZpz = 0;

    for (const z of input.zones) {
      const pz = z.zoneResult.pz;
      sumPz += pz;
      sumRpPz += (z.zoneResult.rp * pz);
      sumRaAz += (z.zoneResult.ra * z.zoneResult.az);

      if (z.vpz > 0) {
        const zpz = z.zoneResult.voz / z.vpz;
        if (zpz > maxZpz) maxZpz = zpz;
      }
    }

    let ps = input.systemPopulation !== null && input.systemPopulation !== undefined ? input.systemPopulation : sumPz;
    if (input.systemPopulation === null || input.systemPopulation === undefined) {
      if (status as string !== 'FAIL') status = 'WARNING';
      warning = 'Ps not provided — calculation assumes D = 1.00.';
    }

    if (ps > sumPz) {
      status = 'FAIL';
      error = 'Ps cannot be greater than sum of Pz';
      ps = sumPz;
    }

    const d = sumPz > 0 ? ps / sumPz : 1.0;
    
    // Vou = D * Sum(Rp*Pz) + Sum(Ra*Az)
    const vou = d * sumRpPz + sumRaAz;

    // Simplified Ev
    const ev = this.getEvFromMaxZpz(maxZpz);
    
    if (maxZpz > 0.75) {
      status = 'FAIL';
      error = 'Max Zpz > 0.75. Alternative Procedure (Appendix A) required.';
    }

    const vot = ev > 0 ? vou / ev : 0;

    return {
      ps, sumPz, d, sumRpPz, sumRaAz, vou, maxZpz, ev, vot, status, warning, error
    };
  }

  private static emptyResult(status: any, warning: string): SimplifiedSystemResult {
    return {
      ps: 0, sumPz: 0, d: 1, sumRpPz: 0, sumRaAz: 0, vou: 0, maxZpz: 0, ev: 1, vot: 0, status, warning
    };
  }
}
