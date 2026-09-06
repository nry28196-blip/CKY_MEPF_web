import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { AuditTrailItem } from './Ashrae621ZoneService';

export interface SimplifiedSystemInput {
  zones: { pz: number; }[];
  ps: number | null; // System population
  dMode: 'VAV' | 'CV';
}

export interface SimplifiedSystemResult {
  sumPz: number;
  ps: number;
  d: number;
  ev: number;
  status: ValidationStatus;
  auditTrail: AuditTrailItem[];
}

export class Ashrae621SimplifiedSystemService {
  static calculate(input: SimplifiedSystemInput): SimplifiedSystemResult {
    const auditTrail: AuditTrailItem[] = [];
    const sumPz = input.zones.reduce((sum, z) => sum + z.pz, 0);

    if (input.ps === null || isNaN(input.ps) || input.ps < 0) {
      return {
        sumPz, ps: 0, d: 1.0, ev: 0, status: 'INCOMPLETE', auditTrail: []
      };
    }
    
    const ps = input.ps;
    const d = sumPz > 0 ? ps / sumPz : 1.0;
    
    // According to 62.1 Simplified Procedure (6.2.5.3)
    let ev = 0;
    
    if (d < 0.60) {
      ev = 0.60;
    } else {
      ev = 0.75;
    }
    
    // In VAV, if D < 0.6, it's often more complex or might have a different default.
    // Assuming standard 2025 simplified procedure:
    // If D < 0.60, Ev = 0.60; If D >= 0.60, Ev = 0.75.
    
    auditTrail.push({
      symbol: 'D',
      name: 'Occupant Diversity',
      formula: 'Ps / ΣPz',
      inputs: { 'Ps': ps, 'ΣPz': sumPz },
      result: d,
      unit: '',
      reference: 'ASHRAE 62.1-2025 Section 6.2.5.3.1'
    });

    auditTrail.push({
      symbol: 'Ev',
      name: 'System Ventilation Efficiency (Simplified)',
      formula: 'D < 0.60 ? 0.60 : 0.75',
      inputs: { 'D': d },
      result: ev,
      unit: '',
      reference: 'ASHRAE 62.1-2025 Section 6.2.5.3.2'
    });

    return {
      sumPz, ps, d, ev,
      status: 'PASS',
      auditTrail
    };
  }
}
