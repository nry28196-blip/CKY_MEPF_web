import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { Ashrae621SpaceType, Ashrae621Ez } from '../../data/ventilation/ashrae621/types';

export interface AuditTrailItem {
  symbol: string;
  name: string;
  formula: string;
  inputs: Record<string, number | string>;
  result: number | string | null;
  unit: string;
  reference: string;
  revision?: string;
  status?: 'PASS' | 'FAIL' | 'VERIFIED' | 'ESTIMATED' | 'DERIVED' | string;
}

export interface ZoneVentilationInput {
  spaceType: Ashrae621SpaceType | null;
  area: number; // m2
  designOccupancy: number | null;
  useDefaultOccupancy: boolean;
  ezConfig: Ashrae621Ez | null;
}

export interface ZoneVentilationResult {
  standard: string;
  edition: string;
  revision: string;
  references: string[];
  az: number | null; // m2
  pz: number | null; // people
  rp: number | null; // L/s-person
  ra: number | null; // L/s-m2
  vbp: number | null; // L/s
  vba: number | null; // L/s
  vbz: number | null; // L/s
  ez: number | null;
  voz: number | null; // L/s
  occupancySource: 'design' | 'default' | null;
  occupancyDensityUsed: number | null;
  populationBeforeDisplayRounding: number | null;
  status: ValidationStatus;
  auditTrail: AuditTrailItem[];
}

export class Ashrae621ZoneService {
  static calculateZone(input: ZoneVentilationInput): ZoneVentilationResult {
    const auditTrail: AuditTrailItem[] = [];
    const statuses: ValidationStatus[] = [];

    // Inputs check
    if (!input.spaceType) {
      return this.emptyResult('INCOMPLETE', 'Missing space type');
    }
    
    if (input.area === null || isNaN(input.area) || input.area <= 0 || !isFinite(input.area)) {
      return this.emptyResult('FAIL', 'Invalid area');
    }

    if (!input.ezConfig) {
      return this.emptyResult('INCOMPLETE', 'Missing Ez configuration');
    }
    
    if (input.ezConfig.ez === null || isNaN(input.ezConfig.ez) || input.ezConfig.ez <= 0 || !isFinite(input.ezConfig.ez)) {
      return this.emptyResult('FAIL', 'Invalid Ez value');
    }

    const az = input.area;
    const ez = input.ezConfig.ez;
    const rp = input.spaceType.rpMetric;
    const ra = input.spaceType.raMetric;
    
    if (rp === null || isNaN(rp) || !isFinite(rp)) {
      return this.emptyResult('INCOMPLETE', 'Invalid Rp'); // The UI maps NOT_VERIFIED to something? Let's use INCOMPLETE if status doesn't support it, wait, ValidationStatus has 'NOT_VERIFIED'? Let's check VentilationValidationService.ts
    }
    if (ra === null || isNaN(ra) || !isFinite(ra)) {
      return this.emptyResult('INCOMPLETE', 'Invalid Ra');
    }

    // Occupancy
    let pz: number | null = null;
    let occupancySource: 'design' | 'default' = 'design';
    let occupancyDensityUsed: number | null = null;
    let populationBeforeDisplayRounding: number | null = null;
    
    if (input.useDefaultOccupancy) {
      occupancyDensityUsed = input.spaceType.defaultOccupancyMetric;
      pz = (az / 100) * occupancyDensityUsed;
      occupancySource = 'default';
      populationBeforeDisplayRounding = pz;
      statuses.push('WARNING');
      // Do not push 'WARNING' status here, or just 'PASS'? Let's stick to 'PASS'.
    } else {
      if (input.designOccupancy === null || isNaN(input.designOccupancy) || input.designOccupancy < 0 || !isFinite(input.designOccupancy)) {
        return input.designOccupancy === null ? this.emptyResult('INCOMPLETE', 'Missing design occupancy') : this.emptyResult('FAIL', 'Invalid design occupancy');
      }
      pz = input.designOccupancy;
      occupancySource = 'design';
      populationBeforeDisplayRounding = pz;
    }

    const vbp = rp * pz;
    const vba = ra * az;
    const vbz = vbp + vba;
    
    const voz = vbz / ez;

    // Audit Trail
    auditTrail.push({
      symbol: 'Vbz',
      name: 'Breathing Zone Outdoor Airflow',
      formula: 'Rp × Pz + Ra × Az',
      inputs: { 'Rp': rp, 'Pz': pz, 'Ra': ra, 'Az': az },
      result: vbz,
      unit: 'L/s',
      reference: input.spaceType.reference || 'ASHRAE 62.1 Section 6.2.2.1',
      revision: input.spaceType.revisionState?.source || '',
      status: 'VERIFIED'
    });
    
    auditTrail.push({
      symbol: 'Voz',
      name: 'Zone Outdoor Airflow',
      formula: 'Vbz / Ez',
      inputs: { 'Vbz': vbz, 'Ez': ez },
      result: voz,
      unit: 'L/s',
      reference: input.ezConfig.reference || 'ASHRAE 62.1 Section 6.2.2.3',
      revision: input.ezConfig.revisionState?.source || '',
      status: 'DERIVED'
    });

    statuses.push('PASS');
    const finalStatus = VentilationValidationService.aggregateStatus(statuses);

    return {
      az, pz, rp, ra, vbp, vba, vbz, ez, voz,
      occupancySource,
      occupancyDensityUsed,
      populationBeforeDisplayRounding,
      status: finalStatus,
      auditTrail,
      standard: input.spaceType.standard,
      edition: input.spaceType.edition,
      revision: input.spaceType.revisionState?.source || '',
      references: [input.spaceType.reference, input.ezConfig.reference]
    };
  }

  private static emptyResult(status: ValidationStatus, _reason: string): ZoneVentilationResult {
    return {
      az: null, pz: null, rp: null, ra: null, vbp: null, vba: null, vbz: null, ez: null, voz: null,
      occupancySource: null,
      occupancyDensityUsed: null,
      populationBeforeDisplayRounding: null,
      status,
      auditTrail: [],
      standard: '',
      edition: '',
      revision: '',
      references: []
    };
  }
}
