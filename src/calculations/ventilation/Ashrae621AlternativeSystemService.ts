import { ZoneVentilationResult } from './Ashrae621ZoneService';

export interface AlternativeZoneInput {
  zoneResult: ZoneVentilationResult;
  vpz: number; // design primary airflow
  vpzMin: number; // min primary airflow for VAV
  ep?: number; // primary air fraction (default 1.0)
  er?: number; // secondary recirculation fraction (default 0.0)
}

export interface AlternativeSystemInput {
  zones: AlternativeZoneInput[];
  systemPopulation?: number | null; // Ps
  vps?: number | null; // System primary airflow
}

export interface AlternativeSystemResult {
  ps: number;
  sumPz: number;
  d: number;
  vou: number;
  vps: number;
  xs: number;
  ev: number;
  vot: number;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE';
  warning?: string;
  error?: string;
  zoneResults: {
    zpz: number;
    evz: number;
  }[];
}

export class Ashrae621AlternativeSystemService {
  static calculate(input: AlternativeSystemInput): AlternativeSystemResult {
    let status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE' = 'PASS';
    let warning = undefined;
    let error = undefined;
    
    if (!input.zones || input.zones.length === 0) {
      return this.emptyResult('INCOMPLETE', 'No zones provided');
    }

    let sumPz = 0;
    let sumRpPz = 0;
    let sumRaAz = 0;
    let vou = 0;
    let sumVpz = 0;
    let sumVpzMin = 0;

    for (const z of input.zones) {
      const pz = z.zoneResult.pz;
      sumPz += pz;
      sumRpPz += (z.zoneResult.rp * pz);
      sumRaAz += (z.zoneResult.ra * z.zoneResult.az);
      vou += z.zoneResult.voz;
      sumVpz += z.vpz;
      sumVpzMin += z.vpzMin;
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
    
    // In Appendix A, Vou = D * Sum(Rp*Pz) + Sum(Ra*Az)
    vou = d * sumRpPz + sumRaAz;

    let vps = input.vps !== null && input.vps !== undefined ? input.vps : sumVpz;
    if (input.vps === null || input.vps === undefined) {
      if (status as string !== 'FAIL') status = 'WARNING';
      warning = (warning ? warning + ' ' : '') + 'System primary airflow (Vps) not provided. Assuming Sum(Vpz).';
    }

    const xs = vps > 0 ? vou / vps : 0;
    
    let ev = 1.0;
    const zoneResults = [];

    for (const z of input.zones) {
      // Calculate Evz for each zone
      // Zpz = Voz / Vpz-min
      const zpz = z.vpzMin > 0 ? z.zoneResult.voz / z.vpzMin : 0;
      
      if (zpz > 1.0) {
        status = 'FAIL';
        error = `Zone minimum primary airflow (Vpz-min) cannot satisfy the required outdoor airflow. Zpz = ${zpz.toFixed(2)} > 1.0.`;
      }

      const ep = z.ep ?? 1.0;
      const er = z.er ?? 0.0;
      const ez = z.zoneResult.ez;
      
      const fa = ep + (1 - ep) * er;
      const fb = ep;
      const fc = 1 - (1 - ez) * (1 - er) * (1 - ep);
      
      const evz = fa > 0 ? (fa + xs * fb - zpz * ep * fc) / fa : 1.0;
      if (evz < ev) {
        ev = evz;
      }

      zoneResults.push({
        zpz,
        evz
      });
    }

    ev = Math.max(0.1, Math.min(1.0, ev));
    const vot = ev > 0 ? vou / ev : 0;

    return {
      ps, sumPz, d, vou, vps, xs, ev, vot, status, warning, error, zoneResults
    };
  }

  private static emptyResult(status: any, warning: string): AlternativeSystemResult {
    return {
      ps: 0, sumPz: 0, d: 1, vou: 0, vps: 0, xs: 0, ev: 1, vot: 0, status, warning, zoneResults: []
    };
  }
}
