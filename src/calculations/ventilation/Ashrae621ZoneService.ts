import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { Ashrae621SpaceType, Ashrae621Ez } from '../../data/ventilation/ashrae621/types';
import { DataProvenanceValidationService } from './DataProvenanceValidationService';

export interface AuditTrailItem {
  symbol: string;
  name: string;
  formula: string;
  inputs: Record<string, number | string>;
  result: number | string | null;
  unit: string;
  reference: string;
  revision?: string;
  status?: 'PASS' | 'FAIL' | 'VERIFIED' | 'NOT_VERIFIED' | 'ESTIMATED' | 'DERIVED' | string;
}

export interface ZoneVentilationInput {
  expectedStandard: string;
  expectedEdition: string;
  spaceType: Ashrae621SpaceType | null;
  area: number; // m2
  designOccupancy: number | null;
  useDefaultOccupancy: boolean;
  ezConfig: Ashrae621Ez | null;
}

export interface ZoneVentilationResult {
  reason?: string;
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

    if (!input.spaceType) {
      return this.emptyResult('INCOMPLETE', 'Missing Space Type');
    }
    if (!input.ezConfig) {
      return this.emptyResult('INCOMPLETE', 'Missing Ez configuration');
    }

    if (input.area === null || isNaN(input.area) || input.area <= 0 || !isFinite(input.area)) {
      return this.emptyResult('FAIL', 'Invalid Area');
    }
    if (input.ezConfig.ez === null || isNaN(input.ezConfig.ez) || input.ezConfig.ez <= 0 || !isFinite(input.ezConfig.ez)) {
      return this.emptyResult('FAIL', 'Invalid Ez');
    }

    const spaceTypeValidation = DataProvenanceValidationService.validateSpaceTypeData(
      input.spaceType, input.expectedStandard, input.expectedEdition, input.useDefaultOccupancy
    );
    if (!spaceTypeValidation.valid) {
      return this.emptyResult(spaceTypeValidation.status, spaceTypeValidation.reasons[0]);
    }

    const ezValidation = DataProvenanceValidationService.validateEzData(
      input.ezConfig, input.expectedStandard, input.expectedEdition
    );
    if (!ezValidation.valid) {
      return this.emptyResult(ezValidation.status, ezValidation.reasons[0]);
    }

    const az = input.area;
    const ez = input.ezConfig.ez;
    const rp = input.spaceType.rpMetric;
    const ra = input.spaceType.raMetric;

    if (rp === null || isNaN(rp) || !isFinite(rp)) return this.emptyResult('INCOMPLETE', 'Invalid Rp');
    if (ra === null || isNaN(ra) || !isFinite(ra)) return this.emptyResult('INCOMPLETE', 'Invalid Ra');

    let pz: number | null = null;
    let occupancySource: 'design' | 'default' = 'design';
    let occupancyDensityUsed: number | null = null;
    let populationBeforeDisplayRounding: number | null = null;

    if (input.useDefaultOccupancy) {
      occupancyDensityUsed = input.spaceType.defaultOccupancyMetric;
      pz = (az / 100) * occupancyDensityUsed;
      occupancySource = 'default';
      populationBeforeDisplayRounding = pz;
    } else {
      if (input.designOccupancy === null || isNaN(input.designOccupancy) || input.designOccupancy < 0 || !isFinite(input.designOccupancy)) {
        return input.designOccupancy === null ? this.emptyResult('INCOMPLETE', 'Missing Occupancy') : this.emptyResult('FAIL', 'Invalid Occupancy');
      }
      pz = input.designOccupancy;
      occupancySource = 'design';
      populationBeforeDisplayRounding = pz;
    }

    const vbp = rp * pz;
    const vba = ra * az;
    const vbz = vbp + vba;
    const voz = vbz / ez;

    auditTrail.push({
      symbol: 'Vbz',
      name: 'Breathing Zone Outdoor Airflow',
      formula: 'Rp × Pz + Ra × Az',
      inputs: { 'Rp': rp, 'Pz': pz, 'Ra': ra, 'Az': az },
      result: vbz,
      unit: 'L/s',
      reference: input.spaceType.reference,
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
      reference: input.ezConfig.reference,
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

  private static emptyResult(status: ValidationStatus, reason: string): ZoneVentilationResult {
    return {
      reason,
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
