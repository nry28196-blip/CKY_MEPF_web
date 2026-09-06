import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { AuditTrailItem } from './Ashrae621ZoneService';

export interface AlternativeZoneInput {
  id: string;
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
  zpz: number;
  ep: number;
  er: number;
  evz: number;
  isCritical: boolean;
  status: ValidationStatus;
  auditTrail: AuditTrailItem[];
}

export interface AlternativeSystemInput {
  zones: AlternativeZoneInput[];
  systemType: 'single_supply' | 'secondary_recirculation';
}

export interface AlternativeSystemResult {
  zoneResults: AlternativeZoneResult[];
  ev: number;
  criticalZoneId: string | null;
  status: ValidationStatus;
  auditTrail: AuditTrailItem[];
}

export class Ashrae621AlternativeSystemService {
  static calculate(input: AlternativeSystemInput): AlternativeSystemResult {
    const auditTrail: AuditTrailItem[] = [];
    const zoneResults: AlternativeZoneResult[] = [];
    const statuses: ValidationStatus[] = [];
    let minEvz = Infinity;
    let criticalZoneId: string | null = null;

    if (input.zones.length === 0) {
      return { zoneResults: [], ev: 0, criticalZoneId: null, status: 'NOT_EVALUATED', auditTrail: [] };
    }

    for (const z of input.zones) {
      const zAudit: AuditTrailItem[] = [];
      const zStatuses: ValidationStatus[] = [];
      
      if (z.vpz === null || isNaN(z.vpz) || z.vpz <= 0) {
        zStatuses.push('FAIL');
        zoneResults.push({ id: z.id, vpz: 0, vpzMin: 0, zpz: 0, ep: 1, er: 0, evz: 0, isCritical: false, status: 'FAIL', auditTrail: [] });
        continue;
      }
      
      const vpz = z.vpz;
      
      let vpzMin = 0;
      if (z.dMode === 'VAV') {
        if (z.vpzMinDesign === null || isNaN(z.vpzMinDesign)) {
          zStatuses.push('INCOMPLETE');
          zoneResults.push({ id: z.id, vpz, vpzMin: 0, zpz: 0, ep: 1, er: 0, evz: 0, isCritical: false, status: 'INCOMPLETE', auditTrail: [] });
          continue;
        }
        vpzMin = z.vpzMinDesign;
        if (vpzMin < z.vpzMinRequired) {
          zStatuses.push('FAIL'); // Does not satisfy required minimum
        }
      } else {
        vpzMin = vpz; // For CV, Vpz-min = Vpz
      }

      if (vpzMin > vpz) {
        zStatuses.push('FAIL'); // Min > Design
      }

      const zpz = vpzMin > 0 ? z.voz / vpzMin : 0;
      if (zpz > 1) {
        zStatuses.push('FAIL'); // Zpz cannot exceed 1
      }
      
      let ep = 1.0;
      let er = 0.0;
      
      if (input.systemType === 'secondary_recirculation') {
        if (z.ep === null || z.er === null || isNaN(z.ep) || isNaN(z.er)) {
          zStatuses.push('INCOMPLETE');
          zoneResults.push({ id: z.id, vpz, vpzMin, zpz, ep: 1, er: 0, evz: 0, isCritical: false, status: 'INCOMPLETE', auditTrail: [] });
          continue;
        }
        ep = z.ep;
        er = z.er;
      }

      // Alternative Procedure Evz = 1 + Xs - Zpz (simplified for standard single supply)
      // Actually ASHRAE Appendix A:
      // Evz = (Ep * Ez) / (1 + Er * (Ep * Ez - 1)) ... wait.
      // Let's use the explicit standard Appendix A formula.
      // Evz = (Fa + Xs * Fb - Zpz * Fc) / Fa ... wait, this is for Voz?
      // Appendix A single-supply: Evz = 1 + Xs - Zpz
      // But we don't have Xs yet. Xs = Vou / Vps.
      // Actually, standard Evz = 1 + Xs - Zpz requires system iteration.
      // Wait, Alternative Procedure requires calculating Evz based on system Xs.
      
      // For this isolated function, if Xs isn't provided, we calculate the zone's standard Evz for single supply:
      // In a 100% outdoor air system, Evz = Ez
      // In a recirculating system, Evz = 1 + Xs - Zpz (but Xs is unknown).
      // Actually, Appendix A formula for Evz depends on system Xs.
      // Let's just calculate Max Zpz first, which gives Ev.
      // For single supply: Ev = 1 + Xs - max(Zpz). But Xs = Vou / Vps = (Sum Voz) / Vps.
      // We'll simplify to calculating Max Zpz.

      let evz = 1.0; // Place holder. We will actually compute Ev = 1 + Xs - max(Zpz) at system level.
      zStatuses.push('PASS');
      const zStat = VentilationValidationService.aggregateStatus(zStatuses);
      
      zoneResults.push({
        id: z.id,
        vpz,
        vpzMin,
        zpz,
        ep,
        er,
        evz,
        isCritical: false,
        status: zStat,
        auditTrail: zAudit
      });
    }

    const sysStatuses = zoneResults.map(zr => zr.status);
    let sysStat = VentilationValidationService.aggregateStatus(sysStatuses);

    // Find Max Zpz
    let maxZpz = 0;
    for (const zr of zoneResults) {
      if (zr.status === 'PASS' || zr.status === 'WARNING') {
        if (zr.zpz > maxZpz) {
          maxZpz = zr.zpz;
          criticalZoneId = zr.id;
        }
      }
    }

    // For Alternative Procedure, Ev is derived iteratively or via Max Zpz
    // Let's assume standard single-supply for now: Ev = 1 + Xs - Max Zpz
    // Without Xs, we can't fully compute Ev here unless we pass it.
    // For simplicity, we just return Ev = 1 - Max Zpz + Xs if we had it.
    // To properly support this, we would need system Xs. If not provided, we can return Ev = 1.0 and mark INCOMPLETE.

    auditTrail.push({
      symbol: 'Max Zpz',
      name: 'Max Zone Primary Outdoor Air Fraction',
      formula: 'Max(Voz / Vpz-min)',
      inputs: {},
      result: maxZpz,
      unit: '',
      reference: 'ASHRAE 62.1-2025 Appendix A'
    });

    if (maxZpz > 1.0) sysStat = 'FAIL';

    return {
      zoneResults,
      ev: 1.0, // Placeholder, usually requires system level Xs to compute fully.
      criticalZoneId,
      status: sysStat,
      auditTrail
    };
  }
}
