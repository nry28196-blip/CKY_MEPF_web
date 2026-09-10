import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { AuditTrailItem } from './Ashrae621ZoneService';
import { AuditStatus } from '../../types';

export interface AlternativeZoneInput {
  id: string;
  pz: number;
  rp: number;
  ra: number;
  az: number;
  voz: number;
  vpz: number | null; // Zone primary airflow
  vpzMinRequired: number; // Required Vpz-min from calculation (Voz for CV)
  vpzMinDesign: number | null; // User's design minimum
  ep: number | null;
  er: number | null;
  ez: number;
  dMode: 'VAV' | 'CV';
}

export interface AlternativeZoneResult {
  id: string;
  vpz: number;
  vpzMin: number;
  zd: number;
  ep: number;
  er: number;
  fa: number;
  fb: number;
  fc: number;
  evz: number;
  isCritical: boolean;
  status: ValidationStatus;
  auditTrail: AuditTrailItem[];
}

export interface AlternativeSystemInput {
  zones: AlternativeZoneInput[];
  ps: number | null;
  systemType: 'single_supply' | 'secondary_recirculation';
}

export interface AlternativeSystemResult {
  zoneResults: AlternativeZoneResult[];
  ev: number | null;
  vou: number | null;
  vps: number | null;
  xs: number | null;
  criticalZoneId: string | null;
  status: ValidationStatus;
  auditTrail: AuditTrailItem[];
}

export class Ashrae621AlternativeSystemService {
  static calculate(input: AlternativeSystemInput): AlternativeSystemResult {
    const auditTrail: AuditTrailItem[] = [];
    const statuses: ValidationStatus[] = [];

    const sumPz = input.zones.reduce((sum, z) => sum + z.pz, 0);
    const sumRaAz = input.zones.reduce((sum, z) => sum + (z.ra * z.az), 0);
    const sumRpPz = input.zones.reduce((sum, z) => sum + (z.rp * z.pz), 0);
    
    if (input.ps === null || isNaN(input.ps) || input.ps < 0) {
      statuses.push('INCOMPLETE');
    }
    const ps = (input.ps !== null && !isNaN(input.ps)) ? input.ps : 0;
    const d = sumPz > 0 ? ps / sumPz : 1.0;
    const vou = d * sumRpPz + sumRaAz;

    auditTrail.push({
      symbol: 'Vou',
      name: 'Uncorrected Outdoor Air Intake',
      formula: 'D × Σ(Rp×Pz) + Σ(Ra×Az)',
      inputs: { 'D': d, 'Σ(Rp×Pz)': sumRpPz, 'Σ(Ra×Az)': sumRaAz },
      result: vou,
      unit: 'L/s',
      reference: 'ASHRAE 62.1 Alternative Procedure',
      status: AuditStatus.DERIVED
    });

    let vps = 0;
    let missingVpz = false;
    for (const z of input.zones) {
      if (z.vpz === null || isNaN(z.vpz) || z.vpz <= 0) {
        missingVpz = true;
      } else {
        vps += z.vpz;
      }
    }

    if (missingVpz) {
      statuses.push('INCOMPLETE');
      return { zoneResults: [], ev: null, vou, vps: null, xs: null, criticalZoneId: null, status: 'INCOMPLETE', auditTrail };
    }

    auditTrail.push({
      symbol: 'Vps',
      name: 'System Primary Airflow',
      formula: 'Σ Vpz',
      inputs: {},
      result: vps,
      unit: 'L/s',
      reference: 'ASHRAE 62.1 Alternative Procedure',
      status: AuditStatus.DERIVED
    });

    // Iterative solver for Ev and Xs
    let ev = 1.0;
    let xs = 0;
    let iterations = 0;
    const maxIterations = 50;
    let converged = false;
    
    const zoneCalcs = input.zones.map(z => {
      let vpzMin = z.dMode === 'VAV' ? (z.vpzMinDesign || z.vpzMinRequired) : (z.vpz || 0);
      let zd = vpzMin > 0 ? z.voz / vpzMin : 1.0;
      let ep = input.systemType === 'single_supply' ? 1.0 : (z.ep !== null ? z.ep : 1.0);
      let er = input.systemType === 'single_supply' ? 0.0 : (z.er !== null ? z.er : 0.0);
      let fa = ep + (1 - ep) * er;
      let fb = ep;
      let fc = 1 - (1 - z.ez) * (1 - er) * (1 - ep);
      return { id: z.id, vpzMin, zd, ep, er, fa, fb, fc, evz: 1.0 };
      status: AuditStatus.DERIVED
    });

    while (iterations < maxIterations && !converged) {
      let prevEv = ev;
      xs = vps > 0 ? (vou / ev) / vps : 1.0;
      let minEvz = 1.0;
      
      for (const zc of zoneCalcs) {
        zc.evz = zc.fa > 0 ? (zc.fa + xs * zc.fb - zc.zd * zc.fc) / zc.fa : 1.0;
        if (zc.evz < minEvz) {
          minEvz = zc.evz;
        }
      }
      
      ev = minEvz;
      if (Math.abs(ev - prevEv) < 0.001) {
        converged = true;
      }
      iterations++;
    }

    if (!converged || ev <= 0) {
      statuses.push('FAIL');
    } else {
      statuses.push('PASS');
    }

    auditTrail.push({
      symbol: 'Ev',
      name: 'System Ventilation Efficiency',
      formula: 'min(Evz) [Iterative]',
      inputs: { 'Xs': xs, 'Iterations': iterations },
      result: ev,
      unit: '',
      reference: 'ASHRAE 62.1 Alternative Procedure',
      status: AuditStatus.DERIVED
    });

    const finalStatus = VentilationValidationService.aggregateStatus(statuses);
    
    const zoneResults: AlternativeZoneResult[] = zoneCalcs.map(zc => {
      const zInput = input.zones.find(z => z.id === zc.id)!;
      return {
        id: zc.id,
        vpz: zInput.vpz!,
        vpzMin: zc.vpzMin,
        zd: zc.zd,
        ep: zc.ep,
        er: zc.er,
        fa: zc.fa,
        fb: zc.fb,
        fc: zc.fc,
        evz: zc.evz,
        isCritical: Math.abs(zc.evz - ev) < 0.001,
        status: finalStatus,
        auditTrail: []
      };
      status: AuditStatus.DERIVED
    });

    const criticalZone = zoneResults.find(zr => zr.isCritical);

    return {
      zoneResults,
      ev,
      vou,
      vps,
      xs,
      criticalZoneId: criticalZone ? criticalZone.id : null,
      status: finalStatus,
      auditTrail
    };
  }
}
