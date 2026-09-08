const fs = require('fs');

const code = `import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
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

    if (input.area === null || isNaN(input.area) || input.area <= 0 || !isFinite(input.area)) {
      return this.emptyResult('FAIL', 'Invalid Area');
    }

    if (!input.ezConfig) {
      return this.emptyResult('INCOMPLETE', 'Missing Ez configuration');
    }

    if (input.ezConfig.ez === null || isNaN(input.ezConfig.ez) || input.ezConfig.ez <= 0 || !isFinite(input.ezConfig.ez)) {
      return this.emptyResult('FAIL', 'Invalid Ez');
    }

    if (!input.spaceType.reference) {
      return this.emptyResult('NOT_VERIFIED', 'Missing Reference');
    }

    if (!input.ezConfig.reference) {
      return this.emptyResult('NOT_VERIFIED', 'Missing Ez Reference');
    }

    if (input.spaceType.standard !== input.expectedStandard || input.ezConfig.standard !== input.expectedStandard) {
      return this.emptyResult('INCOMPLETE', 'Invalid Standard Configuration');
    }

    if (input.spaceType.edition !== input.expectedEdition || input.ezConfig.edition !== input.expectedEdition) {
      return this.emptyResult('INCOMPLETE', 'Edition Mismatch');
    }
    
    if (input.spaceType.revisionState?.standard !== input.expectedStandard || input.spaceType.revisionState?.edition !== input.expectedEdition) {
      return this.emptyResult('INCOMPLETE', 'Edition Mismatch');
    }

    let isVerified = true;

    if (
      input.spaceType.sourceType === 'UNVERIFIED_DRAFT' || 
      input.spaceType.sourceType === 'UNKNOWN' ||
      input.spaceType.revisionState?.source === 'NOT_VERIFIED'
    ) {
      isVerified = false;
    }

    if (
      input.ezConfig.sourceType === 'UNVERIFIED_DRAFT' || 
      input.ezConfig.sourceType === 'UNKNOWN' ||
      input.ezConfig.revisionState?.source === 'NOT_VERIFIED'
    ) {
      isVerified = false;
    }
    
    if (!isVerified) {
      return this.emptyResult('NOT_VERIFIED', 'Unverified Standard Data');
    }

    const az = input.area;
    const ez = input.ezConfig.ez;
    const rp = input.spaceType.rpMetric;
    const ra = input.spaceType.raMetric;

    if (rp === null || isNaN(rp) || !isFinite(rp)) {
      return this.emptyResult('INCOMPLETE', 'Invalid Rp');
    }
    if (ra === null || isNaN(ra) || !isFinite(ra)) {
      return this.emptyResult('INCOMPLETE', 'Invalid Ra');
    }

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

    const auditStatus = isVerified ? 'VERIFIED' : 'NOT_VERIFIED';

    auditTrail.push({
      symbol: 'Vbz',
      name: 'Breathing Zone Outdoor Airflow',
      formula: 'Rp × Pz + Ra × Az',
      inputs: { 'Rp': rp, 'Pz': pz, 'Ra': ra, 'Az': az },
      result: vbz,
      unit: 'L/s',
      reference: input.spaceType.reference,
      revision: input.spaceType.revisionState?.source || '',
      status: auditStatus
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
      status: auditStatus === 'VERIFIED' ? 'DERIVED' : 'NOT_VERIFIED'
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
`;
fs.writeFileSync('src/calculations/ventilation/Ashrae621ZoneService.ts', code);
