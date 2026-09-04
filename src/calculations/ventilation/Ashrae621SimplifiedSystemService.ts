import { ZoneVentilationResult } from './Ashrae621ZoneService';

export interface SimplifiedZoneInput {
  zoneResult: ZoneVentilationResult;
  vpz: number;
  vpzMin?: number;
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
  ev: number;
  vot: number;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE';
  warning?: string;
  error?: string;
  sumVpzMin?: number;
  sumVpz?: number;
}

export class Ashrae621SimplifiedSystemService {
  static calculate(input: SimplifiedSystemInput): SimplifiedSystemResult {
    let status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE' = 'PASS';
    let warning = undefined;
    let error = undefined;
    
    if (!input.zones || input.zones.length === 0) {
      return this.emptyResult('INCOMPLETE', 'No zones provided');
    }

    let sumPz = 0;
    let sumVpz = 0;
    let sumVpzMin = 0;
    let sumRpPz = 0;
    let sumRaAz = 0;

    for (const z of input.zones) {
      const pz = z.zoneResult.pz;
      sumPz += pz;
      sumRpPz += (z.zoneResult.rp * pz);
      sumRaAz += (z.zoneResult.ra * z.zoneResult.az);
      if (z.vpz !== undefined && !isNaN(z.vpz)) sumVpz += z.vpz;
      if (z.vpzMin !== undefined && !isNaN(z.vpzMin)) sumVpzMin += z.vpzMin;
      
      // Calculate required Vpz-min for VAV systems (1.5 * Voz)
      const requiredVpzMin = z.zoneResult.voz * 1.5;
      if (z.vpzMin !== undefined) {
        if (z.vpzMin < requiredVpzMin) {
          status = 'FAIL';
          error = `Zone Vpz-min (${z.vpzMin.toFixed(1)}) is less than required 1.5 * Voz (${requiredVpzMin.toFixed(1)})`;
        }
      } else {
        if (status !== 'FAIL') {
          status = 'WARNING';
          warning = 'One or more zones missing Vpz-min. If this is a VAV system, you must provide Vpz-min. Evaluated as constant volume.';
        }
      }
    }

    let ps = input.systemPopulation !== null && input.systemPopulation !== undefined ? input.systemPopulation : sumPz;
    if (input.systemPopulation === null || input.systemPopulation === undefined || isNaN(input.systemPopulation)) {
      if (status !== 'FAIL') {
        status = 'INCOMPLETE';
      }
      warning = 'System population (Ps) not provided. Calculation requires explicit Ps.';
    }

    if (ps > sumPz) {
      status = 'FAIL';
      error = 'Ps cannot be greater than sum of Pz';
      ps = sumPz;
    }

    const d = sumPz > 0 ? ps / sumPz : 1.0;
    
    // Vou = D * Sum(Rp*Pz) + Sum(Ra*Az)
    const vou = d * sumRpPz + sumRaAz;

    // Simplified Ev based on D
    let ev = 0.75;
    if (d < 0.60) {
      ev = 0.88 * d + 0.22;
    }
    
    const vot = ev > 0 ? vou / ev : 0;

    return {
      ps, sumPz, d, sumRpPz, sumRaAz, vou, ev, vot, status, warning, error, sumVpzMin, sumVpz
    };
  }

  private static emptyResult(status: any, warning: string): SimplifiedSystemResult {
    return {
      ps: 0, sumPz: 0, d: 1, sumRpPz: 0, sumRaAz: 0, vou: 0, ev: 1, vot: 0, status, warning, sumVpzMin: 0, sumVpz: 0
    };
  }
}
