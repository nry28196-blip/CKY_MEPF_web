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
  sumVpzMin?: number;
  sumVpz?: number;
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
      if (z.vpzMin === undefined || isNaN(z.vpzMin) || z.vpzMin < 0) {
        return this.emptyResult('INCOMPLETE', 'Missing or invalid Vpz-min for one or more zones.');
      }
      if (z.vpz === undefined || isNaN(z.vpz) || z.vpz < 0) {
        return this.emptyResult('INCOMPLETE', 'Missing or invalid Vpz for one or more zones.');
      }
      if (z.vpzMin > z.vpz) {
        status = 'FAIL';
        error = 'Vpz-min must not exceed Vpz unless explicitly permitted.';
      }
      
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
      if (status as string !== "FAIL" && status as string !== "INCOMPLETE") status = 'WARNING';
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

    let vps = input.vps;
    if (input.vps === null || input.vps === undefined || isNaN(input.vps)) {
      if (status !== 'FAIL') {
        status = 'INCOMPLETE';
      }
      warning = (warning ? warning + ' ' : '') + 'System primary airflow (Vps) is required for alternative procedure.';
      vps = sumVpz;
    }

    const xs = (vps !== undefined && vps > 0) ? vou / vps : 0;
    
    let ev = 1.0;
    const zoneResults = [];
    
    for (const z of input.zones) {
      const zpz = z.vpzMin > 0 ? z.zoneResult.voz / z.vpzMin : 0;
      
      if (zpz > 1.0) {
        status = 'FAIL';
        error = `Zone minimum primary airflow (Vpz-min) cannot satisfy the required outdoor airflow. Zpz = ${zpz.toFixed(2)} > 1.0. Increase Vpz-min for the critical zone.`;
      }
      
      if (z.ep === undefined || isNaN(z.ep)) {
        if (status !== 'FAIL') status = 'INCOMPLETE';
        warning = 'Primary air fraction (Ep) is missing for one or more zones.';
      }
      const ep = z.ep !== undefined && !isNaN(z.ep) ? z.ep : 1.0;
      if (z.er === undefined || isNaN(z.er)) {
        if (status !== 'FAIL') status = 'INCOMPLETE';
        warning = 'Secondary recirculation fraction (Er) is missing for one or more zones.';
      }
      const er = z.er !== undefined && !isNaN(z.er) ? z.er : 0.0;
      const ez = z.zoneResult.ez;
      
      const fa = ep + (1 - ep) * er;
      const fb = ep;
      const fc = 1 - (1 - ez) * (1 - er) * (1 - ep);
      
      const evz = fa > 0 ? 1 + xs - zpz : 1.0; // Wait, ASHRAE Appendix A formula for Evz: Evz = 1 + Xs - Zpz (for ep=1, er=0). 
      // General formula is: Evz = (Fa + Xs * Fb - Zpz * Ep * Fc) / Fa
      const evz_general = fa > 0 ? (fa + xs * fb - zpz * ep * fc) / fa : 1.0;
      
      if (evz_general < ev) {
        ev = evz_general;
      }
      zoneResults.push({
        zpz,
        evz: evz_general
      });
    }

    // Do NOT clamp invalid Ev.
    if (ev <= 0 || ev > 1.0 || isNaN(ev)) {
      status = 'FAIL';
      error = (error ? error + ' ' : '') + `Calculated Ev is invalid (${ev.toFixed(2)}). Check Xs, Zpz and zone parameters.`;
    }

    const vot = ev > 0 ? vou / ev : 0;

    return {
      ps, sumPz, d, vou, vps: vps === undefined || isNaN(vps) ? 0 : vps, xs, ev, vot, status, warning, error, zoneResults, sumVpzMin, sumVpz
    };
  }

  private static emptyResult(status: any, warning: string): AlternativeSystemResult {
    return {
      ps: 0, sumPz: 0, d: 1, vou: 0, vps: 0, xs: 0, ev: 1, vot: 0, status, warning, zoneResults: [], sumVpzMin: 0, sumVpz: 0
    };
  }
}
