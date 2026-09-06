import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { Ashrae621SpaceType, Ashrae621Ez } from '../../data/ventilation/ashrae621/2025/data';

export interface AuditTrailItem {
  symbol: string;
  name: string;
  formula: string;
  inputs: Record<string, number | string>;
  result: number | string;
  unit: string;
  reference: string;
}

export interface ZoneVentilationInput {
  spaceType: Ashrae621SpaceType | null;
  area: number; // m2
  designOccupancy: number | null;
  useDefaultOccupancy: boolean;
  ezConfig: Ashrae621Ez | null;
}

export interface ZoneVentilationResult {
  az: number; // m2
  pz: number; // people
  rp: number; // L/s-person
  ra: number; // L/s-m2
  vbp: number; // L/s
  vba: number; // L/s
  vbz: number; // L/s
  ez: number;
  voz: number; // L/s
  occupancySource: 'design' | 'default';
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
    
    if (input.area < 0 || isNaN(input.area)) {
      return this.emptyResult('FAIL', 'Invalid area');
    }

    if (!input.ezConfig) {
      return this.emptyResult('INCOMPLETE', 'Missing Ez configuration');
    }

    if (input.ezConfig.ez <= 0 || input.ezConfig.ez > 2.0) {
      return this.emptyResult('FAIL', 'Invalid Ez value');
    }

    // Occupancy
    let pz = 0;
    let occupancySource: 'design' | 'default' = 'design';
    
    if (input.useDefaultOccupancy) {
      pz = (input.area / 100) * input.spaceType.defaultOccupancyMetric;
      occupancySource = 'default';
      statuses.push('WARNING'); // Standard default used
    } else {
      if (input.designOccupancy === null || input.designOccupancy < 0 || isNaN(input.designOccupancy)) {
        return this.emptyResult('FAIL', 'Invalid design occupancy');
      }
      pz = input.designOccupancy;
    }

    const rp = input.spaceType.rpMetric;
    const ra = input.spaceType.raMetric;
    const az = input.area;
    
    const vbp = rp * pz;
    const vba = ra * az;
    const vbz = vbp + vba;
    
    const ez = input.ezConfig.ez;
    const voz = vbz / ez;

    // Audit Trail
    auditTrail.push({
      symbol: 'Vbz',
      name: 'Breathing Zone Outdoor Airflow',
      formula: 'Rp × Pz + Ra × Az',
      inputs: { 'Rp': rp, 'Pz': pz, 'Ra': ra, 'Az': az },
      result: vbz,
      unit: 'L/s',
      reference: 'ASHRAE 62.1-2025 Section 6.2.2.1'
    });
    
    auditTrail.push({
      symbol: 'Voz',
      name: 'Zone Outdoor Airflow',
      formula: 'Vbz / Ez',
      inputs: { 'Vbz': vbz, 'Ez': ez },
      result: voz,
      unit: 'L/s',
      reference: 'ASHRAE 62.1-2025 Section 6.2.2.3'
    });

    statuses.push('PASS');
    const finalStatus = VentilationValidationService.aggregateStatus(statuses);

    return {
      az, pz, rp, ra, vbp, vba, vbz, ez, voz,
      occupancySource,
      status: finalStatus,
      auditTrail
    };
  }

  private static emptyResult(status: ValidationStatus, _reason: string): ZoneVentilationResult {
    return {
      az: 0, pz: 0, rp: 0, ra: 0, vbp: 0, vba: 0, vbz: 0, ez: 1, voz: 0,
      occupancySource: 'design',
      status,
      auditTrail: []
    };
  }
}
