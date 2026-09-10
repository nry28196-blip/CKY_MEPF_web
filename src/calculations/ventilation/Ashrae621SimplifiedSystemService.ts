import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { AuditTrailItem } from './Ashrae621ZoneService';
import { AuditStatus } from '../../types';

export interface SimplifiedSystemZoneInput {
  id: string;
  pz: number;
  rp: number;
  ra: number;
  az: number;
  voz: number;
  vpz: number | null;
  vpzMinDesign: number | null;
  dMode: 'VAV' | 'CV';
}

export interface SimplifiedSystemInput {
  zones: SimplifiedSystemZoneInput[];
  ps: number | null; // System population
}

export interface SimplifiedSystemResult {
  sumPz: number;
  ps: number;
  d: number;
  ev: number;
  vou: number;
  status: ValidationStatus;
  auditTrail: AuditTrailItem[];
}

export class Ashrae621SimplifiedSystemService {
  static calculate(input: SimplifiedSystemInput): SimplifiedSystemResult {
    const auditTrail: AuditTrailItem[] = [];
    const sumPz = input.zones.reduce((sum, z) => sum + z.pz, 0);
    const sumRaAz = input.zones.reduce((sum, z) => sum + (z.ra * z.az), 0);
    const sumRpPz = input.zones.reduce((sum, z) => sum + (z.rp * z.pz), 0);

    const statuses: ValidationStatus[] = [];

    if (input.ps === null || isNaN(input.ps) || input.ps < 0) {
      statuses.push('INCOMPLETE');
    }

    

    const ps = (input.ps !== null && !isNaN(input.ps)) ? input.ps : 0;
    const d = sumPz > 0 ? ps / sumPz : 1.0;
    
    let ev = 0;
    if (d < 0.60) {
      ev = 0.88 * d + 0.22;
    } else {
      ev = 0.75;
    }
    
    const vou = d * sumRpPz + sumRaAz;

    auditTrail.push({
      symbol: 'D',
      name: 'Occupant Diversity',
      formula: 'Ps / ΣPz',
      inputs: { 'Ps': ps, 'ΣPz': sumPz },
      result: d,
      unit: '',
      reference: 'ASHRAE 62.1-2025 Section 6.2.5.3',
      status: AuditStatus.DERIVED
    });
    
    auditTrail.push({
      symbol: 'Vou',
      name: 'Uncorrected Outdoor Air Intake',
      formula: 'D × Σ(Rp×Pz) + Σ(Ra×Az)',
      inputs: { 'D': d, 'Σ(Rp×Pz)': sumRpPz, 'Σ(Ra×Az)': sumRaAz },
      result: vou,
      unit: 'L/s',
      reference: 'ASHRAE 62.1-2025 Section 6.2.5.3',
      status: AuditStatus.DERIVED
    });

    auditTrail.push({
      symbol: 'Ev',
      name: 'System Ventilation Efficiency (Simplified)',
      formula: 'D < 0.60 ? 0.88×D + 0.22 : 0.75',
      inputs: { 'D': d },
      result: ev,
      unit: '',
      reference: 'ASHRAE 62.1-2025 Section 6.2.5.3',
      status: AuditStatus.DERIVED
    });

    statuses.push('PASS');
    const finalStatus = VentilationValidationService.aggregateStatus(statuses);

    return {
      sumPz, ps, d, ev, vou,
      status: finalStatus,
      auditTrail
    };
  }
}
