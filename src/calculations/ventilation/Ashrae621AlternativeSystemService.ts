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
  vdzMinDesign?: number | null; // Minimum total discharge airflow (required for secondary_recirculation)
  ep?: number | null;
  er: number | null;
  ez: number;
  dMode: 'VAV' | 'CV';
}

export interface AlternativeZoneResult {
  id: string;
  vpz: number;
  vpzMin: number;
  vdzMin: number;
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

    if (input.ps === null || isNaN(input.ps)) {
      statuses.push('INCOMPLETE');
    } else if (input.ps < 0) {
      statuses.push('FAIL');
    }

    if (sumPz < 0) {
      statuses.push('FAIL');
    }

    if (sumPz === 0) {
      statuses.push('INCOMPLETE');
    }

    const ps = (input.ps !== null && !isNaN(input.ps)) ? input.ps : 0;
    
    if (sumPz > 0 && ps > sumPz) {
      statuses.push('FAIL');
      auditTrail.push({
        symbol: 'Invalid Ps',
        name: 'System Population Validation',
        formula: 'Ps <= ΣPz',
        inputs: { 'Ps': ps, 'ΣPz': sumPz },
        result: 'FAIL',
        unit: '',
        reference: 'ASHRAE 62.1-2025',
        status: AuditStatus.FAIL
      });
      const finalStatus = VentilationValidationService.aggregateStatus(statuses);
      return { zoneResults: [], ev: null, vou: null, vps: null, xs: null, criticalZoneId: null, status: finalStatus, auditTrail };
    }

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

        let missingEpEr = false;
    let hasInvalidZd = false;
    let hasZeroVdz = false;
    let hasInvalidEp = false;

    const zoneCalcs = input.zones.map(z => {
      let vpzMin = z.dMode === 'VAV' ? (z.vpzMinDesign !== null && z.vpzMinDesign !== undefined ? z.vpzMinDesign : z.vpzMinRequired) : (z.vpz || 0);
      
      let ep = 1.0;
      let er = 0.0;
      let vdzMin = 0;
      
      if (input.systemType === 'single_supply') {
        ep = 1.0;
        er = 0.0;
        vdzMin = vpzMin;
      } else {
        if (z.er === null || z.er === undefined || isNaN(z.er)) missingEpEr = true;
        else er = z.er;
        
        if (z.dMode === 'VAV' && (z.vpzMinDesign === null || z.vpzMinDesign === undefined || isNaN(z.vpzMinDesign))) {
          missingEpEr = true;
        } else if (z.vpzMinDesign !== null && z.vpzMinDesign !== undefined && z.vpzMinDesign <= 0) {
          hasInvalidEp = true;
        }

        if (z.vdzMinDesign === null || z.vdzMinDesign === undefined || isNaN(z.vdzMinDesign)) {
          missingEpEr = true;
        } else if (z.vdzMinDesign <= 0) {
          hasInvalidEp = true;
          vdzMin = 0;
        } else {
          vdzMin = z.vdzMinDesign;
          ep = vpzMin / vdzMin;
          if (isNaN(ep) || !isFinite(ep) || ep <= 0 || ep > 1.0) {
            hasInvalidEp = true;
          }
        }
      }

      let zd = vdzMin > 0 ? z.voz / vdzMin : 1.0;
      if (zd > 1.0) hasInvalidZd = true;
      if (vdzMin <= 0) hasZeroVdz = true;
      
      let fa = ep + (1 - ep) * er;
      let fb = ep;
      let fc = 1 - (1 - z.ez) * (1 - er) * (1 - ep);
      return { id: z.id, vpzMin, vdzMin, zd, ep, er, fa, fb, fc, evz: 1.0 };
    });

    if (missingEpEr) {
      statuses.push('INCOMPLETE');
      auditTrail.push({
        symbol: 'Ep/Er/VdzMin',
        name: 'Missing Secondary Recirculation Inputs',
        formula: 'Vpz-min, Vdz-min, Er Required',
        inputs: {},
        result: 'INCOMPLETE',
        unit: '',
        reference: 'ASHRAE 62.1 Alternative Procedure',
        status: AuditStatus.FAIL
      });
      const finalStatus = VentilationValidationService.aggregateStatus(statuses);
      return { zoneResults: [], ev: null, vou, vps, xs: null, criticalZoneId: null, status: finalStatus, auditTrail };
    }

    if (hasZeroVdz || hasInvalidZd || hasInvalidEp) {
      statuses.push('FAIL');
      auditTrail.push({
        symbol: 'Zd/Ep',
        name: 'Zone Discharge Airflow Validation',
        formula: 'Zd <= 1.0, 0 < Ep <= 1.0, and Vdz > 0',
        inputs: {},
        result: 'FAIL',
        unit: '',
        reference: 'ASHRAE 62.1-2025 Appendix A',
        status: AuditStatus.FAIL
      });
      const finalStatus = VentilationValidationService.aggregateStatus(statuses);
      return { zoneResults: [], ev: null, vou, vps, xs: null, criticalZoneId: null, status: finalStatus, auditTrail };
    }

    // Iterative solver for Ev and Xs
    let ev: number | null = 1.0;
    let xs = 0;
    let iterations = 0;
    const maxIterations = 50;
    let converged = false;

    while (iterations < maxIterations && !converged) {
      let prevEv = ev!;
      xs = vps > 0 ? (vou / ev!) / vps : 1.0;
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

    let isEvValid = true;
    if (!converged || ev <= 0 || isNaN(ev) || !isFinite(ev)) {
      statuses.push('FAIL');
      isEvValid = false;
      ev = null;
      auditTrail.push({
        symbol: 'Ev',
        name: 'System Ventilation Efficiency',
        formula: 'min(Evz) [Iterative]',
        inputs: { 'Xs': xs, 'Iterations': iterations },
        result: 'FAIL',
        unit: '',
        reference: 'ASHRAE 62.1 Alternative Procedure',
        status: AuditStatus.FAIL
      });
    } else {
      statuses.push('PASS');
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
    }

    const finalStatus = VentilationValidationService.aggregateStatus(statuses);

    if (!isEvValid) {
        return {
          zoneResults: [],
          ev: null,
          vou,
          vps,
          xs,
          criticalZoneId: null,
          status: finalStatus,
          auditTrail
        };
    }

    const zoneResults: AlternativeZoneResult[] = zoneCalcs.map(zc => {
      const zInput = input.zones.find(z => z.id === zc.id)!;
      return {
        id: zc.id,
        vpz: zInput.vpz!,
        vpzMin: zc.vpzMin,
        vdzMin: zc.vdzMin,
        zd: zc.zd,
        ep: zc.ep,
        er: zc.er,
        fa: zc.fa,
        fb: zc.fb,
        fc: zc.fc,
        evz: zc.evz,
        isCritical: Math.abs(zc.evz - ev!) < 0.001,
        status: finalStatus,
        auditTrail: []
      };
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
