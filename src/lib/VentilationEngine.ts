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
  vot: number | null; // L/s
  finalDesignOutdoorAir: number | null;
  auditTrail: AuditTrailItem[];
  revisionState: string;
  status: ValidationStatus;
}

export class VentilationEngine {
  static runSingleZone(input: SingleZoneInput): SingleZoneResult {
    const auditTrail: AuditTrailItem[] = [];
    
    // 1. Calculate Density
    const densityResult = DensityCorrectionService.calculate(input.density);
    
    // 2. Pass Eρ to zone
    const zoneInput = { ...input.zone, eRho: densityResult.eRho };
    const zoneResult = Ashrae621ZoneService.calculateZone(zoneInput);
    
    const statuses = [zoneResult.status, densityResult.status];
    const status = VentilationValidationService.aggregateStatus(statuses);
    
    if (status === 'FAIL' || status === 'INCOMPLETE' || status === 'NOT_VERIFIED') {
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
    
    if (zoneAggrStatus !== 'FAIL' && zoneAggrStatus !== 'INCOMPLETE' && zoneAggrStatus !== 'NOT_VERIFIED' && zoneAggrStatus !== 'NOT_EVALUATED') {
      if (input.method === 'Simplified') {
        const simpInput: SimplifiedSystemInput = {
          zones: zoneResults.map((z, i) => ({
            id: z.id || Math.random().toString(),
            pz: z.pz !== null ? z.pz : 0,
            rp: z.rp || 0,
            ra: z.ra || 0,
            az: z.az !== null ? z.az : 0,
            voz: z.voz || 0,
            vpz: input.zones[i].vpz || null,
            vpzMinDesign: input.zones[i].vpzMinDesign || null,
            dMode: input.zones[i].dMode || 'CV'
          })),
          ps: input.systemPopulation
        };
        simplifiedSystem = Ashrae621SimplifiedSystemService.calculate(simpInput);
        statuses.push(simplifiedSystem.status);
        vou = simplifiedSystem.vou;
        ev = simplifiedSystem.ev;
      } else if (input.method === 'Alternative') {
        const altInput: AlternativeSystemInput = {
          edition: input.edition,
          systemType: input.systemType,
          zones: zoneResults.map((z, i) => ({
            id: z.id || Math.random().toString(),
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
      vot,
      finalDesignOutdoorAir: vot,
      auditTrail,
      revisionState: input.zones.length > 0 ? (input.zones[0].spaceType?.revisionState.source || 'Unknown') : 'Unknown',
      status: finalStatus
    };
  }
}

// Temporarily reconstructed to fix build
