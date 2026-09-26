import { Ashrae621ZoneService, ZoneVentilationInput, ZoneVentilationResult, AuditTrailItem } from '../calculations/ventilation/Ashrae621ZoneService';
import { DensityCorrectionService, DensityInput, DensityResult } from './DensityCorrectionService';
import { ValidationStatus, VentilationValidationService } from '../calculations/ventilation/VentilationValidationService';
import { Ashrae621SimplifiedSystemService, SimplifiedSystemInput, SimplifiedSystemResult } from '../calculations/ventilation/Ashrae621SimplifiedSystemService';
import { Ashrae621AlternativeSystemService, AlternativeSystemInput, AlternativeSystemResult } from '../calculations/ventilation/Ashrae621AlternativeSystemService';

export interface SingleZoneInput {
  edition?: "2019" | "2022" | "2025";
  density: DensityInput;
  zone: ZoneVentilationInput;
}

export interface SingleZoneResult {
  zone: ZoneVentilationResult;
  density: DensityResult;
  voz: number | null; // L/s
  vot: number | null; // L/s (for single zone, Vot = Voz)
  finalDesignOutdoorAir: number | null; // The authoritative final value
  auditTrail: AuditTrailItem[];
  revisionState: string;
  status: ValidationStatus;
}

export interface MultiZoneInput {
  method: 'Simplified' | 'Alternative';
  edition?: "2019" | "2022" | "2025";
  systemType: 'single_supply' | 'secondary_recirculation';
  airDistributionType?: 'CV' | 'VAV';
  vps?: number | null; // System Primary Airflow at Analyzed Design Condition (explicit for VAV)
  vpsDesignBasis?: string;
  designCondition?: string;
  density: DensityInput;
  zones: ZoneVentilationInput[];
  systemPopulation: number | null;
}

export interface MultiZoneResult {
  zoneResults: ZoneVentilationResult[];
  density: DensityResult;
  simplifiedSystem: SimplifiedSystemResult | null;
  alternativeSystem: AlternativeSystemResult | null;
  vou: number | null; // Uncorrected outdoor air
  ev: number | null; // System ventilation efficiency
  vps: number | null;
  vpsDesignBasis?: string;
  designCondition?: string;
  airDistributionType?: 'CV' | 'VAV';
  xs: number | null;
  vot: number | null; // L/s
  finalDesignOutdoorAir: number | null;
  auditTrail: AuditTrailItem[];
  revisionState: string;
  status: ValidationStatus;
}

export class VentilationEngine {
  static runSingleZone(input: SingleZoneInput): SingleZoneResult {
    const auditTrail: AuditTrailItem[] = [];

    // Enforce active standard production boundary at VentilationEngine entry point
    const requestedStandard = (input as any).standard || input.zone?.expectedStandard;
    if (requestedStandard === '62.2' || requestedStandard === 'ASHRAE 62.2') {
      const densityResult = DensityCorrectionService.calculate(input.density);
      return {
        zone: {
          id: input.zone?.spaceType?.id || 'zone-622',
          spaceTypeId: input.zone?.spaceType?.id,
          spaceTypeName: input.zone?.spaceType?.name,
          standard: 'ASHRAE 62.2',
          edition: '2022',
          revision: 'OUTSIDE_SCOPE',
          references: [],
          az: null, pz: null, rp: null, ra: null, vbp: null, vba: null, vbz: null, ez: null, epDensity: null, voz: null,
          occupancySource: null,
          occupancyDensityUsed: null,
          populationBeforeDisplayRounding: null,
          status: 'BLOCKED',
          reason: 'ASHRAE 62.2 is outside the scope of ASHRAE 62.1 commercial calculations.',
          auditTrail: []
        },
        density: densityResult,
        voz: null,
        vot: null,
        finalDesignOutdoorAir: null,
        auditTrail: [],
        revisionState: 'OUTSIDE_SCOPE',
        status: 'BLOCKED'
      };
    }

    const requestedEdition = input.edition || input.zone?.expectedEdition || input.zone?.spaceType?.edition;
    if (requestedEdition === '2025' || input.zone?.expectedEdition === '2025' || input.zone?.spaceType?.edition === '2025') {
      const densityResult = DensityCorrectionService.calculate(input.density);
      return {
        zone: {
          id: input.zone?.spaceType?.id || 'zone-2025',
          spaceTypeId: input.zone?.spaceType?.id,
          spaceTypeName: input.zone?.spaceType?.name,
          standard: 'ASHRAE 62.1',
          edition: '2025',
          revision: 'DEFERRED_2025_NON_PRODUCTION',
          references: [],
          az: null, pz: null, rp: null, ra: null, vbp: null, vba: null, vbz: null, ez: null, epDensity: null, voz: null,
          occupancySource: null,
          occupancyDensityUsed: null,
          populationBeforeDisplayRounding: null,
          status: 'BLOCKED',
          reason: 'ASHRAE 62.1-2025 is deferred and not approved for production use. Calculations for this edition are BLOCKED.',
          auditTrail: []
        },
        density: densityResult,
        voz: null,
        vot: null,
        finalDesignOutdoorAir: null,
        auditTrail: [],
        revisionState: 'DEFERRED_2025_NON_PRODUCTION',
        status: 'BLOCKED'
      };
    }

    if (requestedEdition === '2019' || input.zone?.expectedEdition === '2019' || input.zone?.spaceType?.edition === '2019') {
      const densityResult = DensityCorrectionService.calculate(input.density);
      return {
        zone: {
          id: input.zone?.spaceType?.id || 'zone-2019',
          spaceTypeId: input.zone?.spaceType?.id,
          spaceTypeName: input.zone?.spaceType?.name,
          standard: 'ASHRAE 62.1',
          edition: '2019',
          revision: 'ARCHIVED_2019_NON_PRODUCTION',
          references: [],
          az: null, pz: null, rp: null, ra: null, vbp: null, vba: null, vbz: null, ez: null, epDensity: null, voz: null,
          occupancySource: null,
          occupancyDensityUsed: null,
          populationBeforeDisplayRounding: null,
          status: 'BLOCKED',
          reason: 'ASHRAE 62.1-2019 is archived and not active for production use. Calculations for this edition are BLOCKED.',
          auditTrail: []
        },
        density: densityResult,
        voz: null,
        vot: null,
        finalDesignOutdoorAir: null,
        auditTrail: [],
        revisionState: 'ARCHIVED_2019_NON_PRODUCTION',
        status: 'BLOCKED'
      };
    }

    if (requestedEdition !== undefined && requestedEdition !== '2022') {
      const densityResult = DensityCorrectionService.calculate(input.density);
      return {
        zone: {
          id: input.zone?.spaceType?.id || 'zone-invalid',
          spaceTypeId: input.zone?.spaceType?.id,
          spaceTypeName: input.zone?.spaceType?.name,
          standard: 'ASHRAE 62.1',
          edition: String(requestedEdition),
          revision: 'UNAPPROVED_EDITION_NON_PRODUCTION',
          references: [],
          az: null, pz: null, rp: null, ra: null, vbp: null, vba: null, vbz: null, ez: null, epDensity: null, voz: null,
          occupancySource: null,
          occupancyDensityUsed: null,
          populationBeforeDisplayRounding: null,
          status: 'BLOCKED',
          reason: `Unknown or unapproved standard edition '${requestedEdition}'. Calculations are restricted to ASHRAE 62.1-2022.`,
          auditTrail: []
        },
        density: densityResult,
        voz: null,
        vot: null,
        finalDesignOutdoorAir: null,
        auditTrail: [],
        revisionState: 'UNAPPROVED_EDITION_NON_PRODUCTION',
        status: 'BLOCKED'
      };
    }
    
    // 1. Calculate Density
    const densityResult = DensityCorrectionService.calculate(input.density);
    
    // 2. Pass Eρ to zone
    const zoneInput = { ...input.zone, eRho: densityResult.eRho };
    const zoneResult = Ashrae621ZoneService.calculateZone(zoneInput);
    
    const statuses = [zoneResult.status, densityResult.status];
    const status = VentilationValidationService.aggregateStatus(statuses);
    
    if (status === 'FAIL' || status === 'INCOMPLETE' || status === 'NOT_VERIFIED' || status === 'BLOCKED') {
        return {
          zone: zoneResult, density: densityResult, voz: null, vot: null, 
          finalDesignOutdoorAir: null, auditTrail: [], revisionState: input.zone?.spaceType?.revisionState.source || 'Unknown', status
        };
    }
    
    const voz = zoneResult.voz; 
    const vot = voz;
    
    return {
      zone: zoneResult,
      density: densityResult,
      voz,
      vot,
      finalDesignOutdoorAir: vot,
      auditTrail,
      revisionState: input.zone?.spaceType?.revisionState.source || 'Unknown',
      status
    };
  }

  static runMultiZone(input: MultiZoneInput): MultiZoneResult {
    const auditTrail: AuditTrailItem[] = [];

    // Enforce active standard production boundary at VentilationEngine entry point
    const requestedStandard = (input as any).standard || (input.zones.length > 0 ? input.zones[0].expectedStandard : undefined);
    const has622 = requestedStandard === '62.2' || requestedStandard === 'ASHRAE 62.2' || input.zones.some(z => z.expectedStandard === '62.2' || z.expectedStandard === 'ASHRAE 62.2');
    if (has622) {
      const densityResult = DensityCorrectionService.calculate(input.density);
      return {
        zoneResults: [],
        density: densityResult,
        simplifiedSystem: null,
        alternativeSystem: null,
        vou: null,
        ev: null,
        vps: input.vps ?? null,
        vpsDesignBasis: input.vpsDesignBasis || 'Highest expected system primary airflow at analyzed design condition',
        designCondition: input.designCondition || 'Cooling design',
        airDistributionType: input.airDistributionType || 'CV',
        xs: null,
        vot: null,
        finalDesignOutdoorAir: null,
        auditTrail: [],
        revisionState: 'OUTSIDE_SCOPE',
        status: 'BLOCKED'
      };
    }

    const requestedEdition = input.edition || (input.zones.length > 0 ? (input.zones[0].expectedEdition || input.zones[0].spaceType?.edition) : undefined);
    if (requestedEdition === '2025' || input.zones.some(z => z.expectedEdition === '2025' || z.spaceType?.edition === '2025')) {
      const densityResult = DensityCorrectionService.calculate(input.density);
      return {
        zoneResults: [],
        density: densityResult,
        simplifiedSystem: null,
        alternativeSystem: null,
        vou: null,
        ev: null,
        vps: input.vps ?? null,
        vpsDesignBasis: input.vpsDesignBasis || 'Highest expected system primary airflow at analyzed design condition',
        designCondition: input.designCondition || 'Cooling design',
        airDistributionType: input.airDistributionType || 'CV',
        xs: null,
        vot: null,
        finalDesignOutdoorAir: null,
        auditTrail: [],
        revisionState: 'DEFERRED_2025_NON_PRODUCTION',
        status: 'BLOCKED'
      };
    }

    if (requestedEdition === '2019' || input.zones.some(z => z.expectedEdition === '2019' || z.spaceType?.edition === '2019')) {
      const densityResult = DensityCorrectionService.calculate(input.density);
      return {
        zoneResults: [],
        density: densityResult,
        simplifiedSystem: null,
        alternativeSystem: null,
        vou: null,
        ev: null,
        vps: input.vps ?? null,
        vpsDesignBasis: input.vpsDesignBasis || 'Highest expected system primary airflow at analyzed design condition',
        designCondition: input.designCondition || 'Cooling design',
        airDistributionType: input.airDistributionType || 'CV',
        xs: null,
        vot: null,
        finalDesignOutdoorAir: null,
        auditTrail: [],
        revisionState: 'ARCHIVED_2019_NON_PRODUCTION',
        status: 'BLOCKED'
      };
    }

    const hasInvalidZone = input.zones.some(z => {
      const ed = z.expectedEdition || z.spaceType?.edition;
      return ed !== undefined && ed !== '2022';
    });
    if ((requestedEdition !== undefined && requestedEdition !== '2022') || hasInvalidZone) {
      const densityResult = DensityCorrectionService.calculate(input.density);
      return {
        zoneResults: [],
        density: densityResult,
        simplifiedSystem: null,
        alternativeSystem: null,
        vou: null,
        ev: null,
        vps: input.vps ?? null,
        vpsDesignBasis: input.vpsDesignBasis || 'Highest expected system primary airflow at analyzed design condition',
        designCondition: input.designCondition || 'Cooling design',
        airDistributionType: input.airDistributionType || 'CV',
        xs: null,
        vot: null,
        finalDesignOutdoorAir: null,
        auditTrail: [],
        revisionState: 'UNAPPROVED_EDITION_NON_PRODUCTION',
        status: 'BLOCKED'
      };
    }
    
    // 1. Calculate Density
    const densityResult = DensityCorrectionService.calculate(input.density);
    
    // 2. Zone Calculations (Pass Eρ for Voz calculation)
    const zoneResults: ZoneVentilationResult[] = [];
    const statuses: ValidationStatus[] = [];
    
    for (const z of input.zones) {
      const zResult = Ashrae621ZoneService.calculateZone({ ...z, eRho: densityResult.eRho });
      zoneResults.push(zResult);
      statuses.push(zResult.status);
    }
    
    const zoneAggrStatus = VentilationValidationService.aggregateStatus(statuses);
    
    let simplifiedSystem: SimplifiedSystemResult | null = null;
    let alternativeSystem: AlternativeSystemResult | null = null;
    let vou: number | null = null;
    let ev: number | null = null;
    let vps: number | null = null;
    let xs: number | null = null;
    
    if (zoneAggrStatus !== 'FAIL' && zoneAggrStatus !== 'INCOMPLETE' && zoneAggrStatus !== 'NOT_VERIFIED' && zoneAggrStatus !== 'NOT_EVALUATED') {
      if (input.method === 'Simplified') {
        const simpInput: SimplifiedSystemInput = {
          zones: zoneResults.map((z, i) => ({
            id: z.id || Math.random().toString(),
            name: input.zones[i].id || `Zone ${i + 1}`,
            pz: z.pz !== null ? z.pz : 0,
            rp: z.rp || 0,
            ra: z.ra || 0,
            az: z.az !== null ? z.az : 0,
            voz: z.voz || 0,
            vpz: input.zones[i].vpz || null,
            vpzMinDesign: input.zones[i].vpzMinDesign || null,
            dMode: input.zones[i].dMode || 'CV'
          })),
          ps: input.systemPopulation,
          airDistributionType: input.airDistributionType || (input.zones.some(z => z.dMode === 'VAV') ? 'VAV' : 'CV'),
          vps: input.vps ?? null,
          vpsDesignBasis: input.vpsDesignBasis,
          designCondition: input.designCondition
        };
        simplifiedSystem = Ashrae621SimplifiedSystemService.calculate(simpInput);
        statuses.push(simplifiedSystem.status);
        vou = simplifiedSystem.vou;
        ev = simplifiedSystem.ev;
        vps = simplifiedSystem.vps;
        xs = simplifiedSystem.xs;
      } else if (input.method === 'Alternative') {
        const altInput: AlternativeSystemInput = {
          edition: input.edition,
          systemType: input.systemType,
          airDistributionType: input.airDistributionType || (input.zones.some(z => z.dMode === 'VAV') ? 'VAV' : 'CV'),
          vps: input.vps ?? null,
          vpsDesignBasis: input.vpsDesignBasis,
          designCondition: input.designCondition,
          zones: zoneResults.map((z, i) => ({
            id: z.id || Math.random().toString(),
            name: input.zones[i].id || `Zone ${i + 1}`,
            pz: z.pz !== null ? z.pz : 0,
            rp: z.rp || 0,
            ra: z.ra || 0,
            az: z.az !== null ? z.az : 0,
            voz: z.voz || 0,
            vpz: input.zones[i].vpz || null,
            vpzMinDesign: input.zones[i].vpzMinDesign || null,
            vpzMinRequired: input.zones[i].vpzMinRequired || null,
            vdzMinDesign: input.zones[i].vdzMinDesign || null,
            dMode: input.zones[i].dMode || 'CV',
            ep: input.zones[i].ep || null,
            er: input.zones[i].er || null,
            ez: z.ez || 1.0
          })),
          ps: input.systemPopulation
        };
        alternativeSystem = Ashrae621AlternativeSystemService.calculate(altInput);
        statuses.push(alternativeSystem.status);
        vou = alternativeSystem.vou;
        ev = alternativeSystem.ev;
        vps = alternativeSystem.vps;
        xs = alternativeSystem.xs;
      }
    }
    
    statuses.push(densityResult.status);
    if (ev !== null && ev <= 0) statuses.push('FAIL');
    
    let finalStatus = VentilationValidationService.aggregateStatus(statuses);
    
    let vot: number | null = null;
    
    if (finalStatus !== 'FAIL' && finalStatus !== 'INCOMPLETE' && finalStatus !== 'NOT_VERIFIED' && finalStatus !== 'NOT_EVALUATED' && ev !== null && ev > 0 && vou !== null) {
      vot = vou / ev;
      
      auditTrail.push({
        symbol: 'Vot',
        name: 'Required System Outdoor Air',
        formula: 'Vou / Ev',
        inputs: { 'Vou': vou, 'Ev': ev },
        result: vot,
        unit: 'L/s',
        reference: 'ASHRAE 62.1 Equation 6-10'
      });
    } else {
        if(finalStatus === 'PASS') finalStatus = 'INCOMPLETE';
    }
    
    return {
      zoneResults,
      density: densityResult,
      simplifiedSystem,
      alternativeSystem,
      vou,
      ev,
      vps,
      vpsDesignBasis: input.vpsDesignBasis || 'Highest expected system primary airflow at analyzed design condition',
      designCondition: input.designCondition || 'Cooling design',
      airDistributionType: input.airDistributionType || (input.zones.some(z => z.dMode === 'VAV') ? 'VAV' : 'CV'),
      xs,
      vot,
      finalDesignOutdoorAir: vot,
      auditTrail,
      revisionState: input.zones.length > 0 ? (input.zones[0].spaceType?.revisionState.source || 'Unknown') : 'Unknown',
      status: finalStatus
    };
  }
}

// Temporarily reconstructed to fix build
