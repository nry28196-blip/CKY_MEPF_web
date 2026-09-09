const fs = require('fs');
const file = 'src/calculations/ventilation/Ashrae621ZoneService.ts';
let content = fs.readFileSync(file, 'utf8');

// I will rewrite calculateZone completely
const replacement = `  static calculateZone(input: ZoneVentilationInput): ZoneVentilationResult {
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

    if (input.spaceType.standard !== input.expectedStandard || input.ezConfig.standard !== input.expectedStandard) {
      return this.emptyResult('INCOMPLETE', 'Invalid Standard Configuration');
    }
    if (input.spaceType.edition !== input.expectedEdition || input.ezConfig.edition !== input.expectedEdition) {
      return this.emptyResult('INCOMPLETE', 'Edition Mismatch');
    }
    if (input.spaceType.revisionState?.standard !== input.expectedStandard || input.spaceType.revisionState?.edition !== input.expectedEdition) {
      return this.emptyResult('INCOMPLETE', 'Revision Mismatch');
    }

    // Check specific provenances if available, otherwise fallback to record level
    if (input.spaceType.provenance?.reference?.sourceType === 'NOT_VERIFIED' || input.spaceType.provenance?.reference?.sourceType === 'UNVERIFIED_DRAFT' || !input.spaceType.reference) {
      return this.emptyResult('NOT_VERIFIED', 'Missing Reference');
    }
    if (input.ezConfig.provenance?.reference?.sourceType === 'NOT_VERIFIED' || input.ezConfig.provenance?.reference?.sourceType === 'UNVERIFIED_DRAFT' || !input.ezConfig.reference) {
      return this.emptyResult('NOT_VERIFIED', 'Missing Ez Reference');
    }

    if (input.spaceType.provenance) {
      if (input.spaceType.provenance.rp?.sourceType !== 'VERIFIED') return this.emptyResult('NOT_VERIFIED', 'Unverified Rp');
      if (input.spaceType.provenance.ra?.sourceType !== 'VERIFIED') return this.emptyResult('NOT_VERIFIED', 'Unverified Ra');
      if (input.useDefaultOccupancy && input.spaceType.provenance.defaultOccupancy?.sourceType !== 'VERIFIED') return this.emptyResult('NOT_VERIFIED', 'Unverified Occupancy Density');
    } else {
      if (input.spaceType.sourceType === 'UNVERIFIED_DRAFT' || input.spaceType.sourceType === 'UNKNOWN' || input.spaceType.revisionState?.source === 'NOT_VERIFIED') {
        return this.emptyResult('NOT_VERIFIED', 'Unverified Space Type');
      }
    }

    if (input.ezConfig.provenance) {
      if (input.ezConfig.provenance.ez?.sourceType !== 'VERIFIED') return this.emptyResult('NOT_VERIFIED', 'Unverified Ez');
      if (input.ezConfig.provenance.applicability?.sourceType !== 'VERIFIED') return this.emptyResult('NOT_VERIFIED', 'Unverified Ez Applicability');
    } else {
      if (input.ezConfig.sourceType === 'UNVERIFIED_DRAFT' || input.ezConfig.sourceType === 'UNKNOWN' || input.ezConfig.revisionState?.source === 'NOT_VERIFIED') {
        return this.emptyResult('NOT_VERIFIED', 'Unverified Ez');
      }
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
  }`;

content = content.replace(/  static calculateZone\([\s\S]*?  private static emptyResult/m, replacement + "\n\n  private static emptyResult");
fs.writeFileSync(file, content);
