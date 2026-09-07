import { ValidationStatus, VentilationValidationService } from '../calculations/ventilation/VentilationValidationService';
import { Ashrae621ZoneService, ZoneVentilationInput, ZoneVentilationResult } from '../calculations/ventilation/Ashrae621ZoneService';
import { Ashrae621SimplifiedSystemService, SimplifiedSystemInput, SimplifiedSystemResult, SimplifiedSystemZoneInput } from '../calculations/ventilation/Ashrae621SimplifiedSystemService';
import { Ashrae621AlternativeSystemService, AlternativeSystemInput, AlternativeSystemResult, AlternativeZoneInput } from '../calculations/ventilation/Ashrae621AlternativeSystemService';
import { Ashrae621DensityService, DensityInput, DensityResult } from '../calculations/ventilation/Ashrae621DensityService';

export interface SingleZoneInput {
  zone: ZoneVentilationInput;
  density: DensityInput | null;
}

export interface SingleZoneResult {
  zone: ZoneVentilationResult;
  density: DensityResult;
  vozStandard: number; // L/s
  votStandard: number; // L/s (for single zone, Vot = Voz)
  votDensityCorrected: number | null; // L/s
  finalDesignOutdoorAir: number | null; // The authoritative final value
  revisionState: string;
  status: ValidationStatus;
}

export interface MultiZoneInput {
  zones: (ZoneVentilationInput & { id: string; dMode: 'VAV'|'CV'; vpz: number|null; vpzMinDesign: number|null; ep: number|null; er: number|null; })[];
  density: DensityInput | null;
  method: 'Simplified' | 'Alternative';
  systemPopulation: number | null; // For Simplified
  systemType: 'single_supply' | 'secondary_recirculation'; // For Alternative
}

export interface MultiZoneResult {
  zones: (ZoneVentilationResult & { id: string })[];
  density: DensityResult;
  simplifiedSystem: SimplifiedSystemResult | null;
  alternativeSystem: AlternativeSystemResult | null;
  vou: number | null; // Uncorrected outdoor air
  ev: number | null; // System ventilation efficiency
  votStandard: number | null; // L/s
  votDensityCorrected: number | null; // L/s
  finalDesignOutdoorAir: number | null;
  revisionState: string;
  status: ValidationStatus;
}

export class VentilationEngine {
  
  static runSingleZone(input: SingleZoneInput): SingleZoneResult {
    const zoneResult = Ashrae621ZoneService.calculateZone(input.zone);
    const densityResult = Ashrae621DensityService.calculateDensityCorrection(input.density);
    
    const statuses = [zoneResult.status, densityResult.status];
    const status = VentilationValidationService.aggregateStatus(statuses);
    
    if (status === 'FAIL' || status === 'INCOMPLETE') {
        return {
          zone: zoneResult, density: densityResult, vozStandard: zoneResult.voz, votStandard: zoneResult.voz, 
          votDensityCorrected: null, finalDesignOutdoorAir: null, revisionState: 'ASHRAE 62.1-2025 Base + Errata', status
        };
    }
    
    const vozStandard = zoneResult.voz;
    const votStandard = vozStandard;
    const votDensityCorrected = votStandard * densityResult.eRho;
    
    return {
      zone: zoneResult,
      density: densityResult,
      vozStandard,
      votStandard,
      votDensityCorrected,
      finalDesignOutdoorAir: votDensityCorrected,
      revisionState: 'ASHRAE 62.1-2025 Base + Errata',
      status
    };
  }

  static runMultiZone(input: MultiZoneInput): MultiZoneResult {
    const zoneResults = input.zones.map(z => ({
      ...Ashrae621ZoneService.calculateZone(z),
      id: z.id
    }));
    
    const densityResult = Ashrae621DensityService.calculateDensityCorrection(input.density);
    
    let vou: number | null = null;
    let ev: number | null = null;
    
    let simplifiedSystem: SimplifiedSystemResult | null = null;
    let alternativeSystem: AlternativeSystemResult | null = null;
    
    const statuses = zoneResults.map(z => z.status);
    
    if (input.method === 'Simplified') {
      const simplifiedZones: SimplifiedSystemZoneInput[] = input.zones.map((z, idx) => ({
        id: z.id,
        pz: zoneResults[idx].pz,
        rp: zoneResults[idx].rp,
        ra: zoneResults[idx].ra,
        az: zoneResults[idx].az,
        voz: zoneResults[idx].voz,
        vpz: z.vpz,
        vpzMinDesign: z.vpzMinDesign,
        dMode: z.dMode
      }));

      simplifiedSystem = Ashrae621SimplifiedSystemService.calculate({
        zones: simplifiedZones,
        ps: input.systemPopulation
      });
      ev = simplifiedSystem.ev;
      vou = simplifiedSystem.vou;
      statuses.push(simplifiedSystem.status);
    } else {
      const altZones: AlternativeZoneInput[] = input.zones.map((z, idx) => ({
        id: z.id,
        voz: zoneResults[idx].voz,
        vpz: z.vpz,
        vpzMinRequired: zoneResults[idx].voz, 
        vpzMinDesign: z.vpzMinDesign,
        ep: z.ep,
        er: z.er,
        ez: zoneResults[idx].ez,
        dMode: z.dMode
      }));
      
      alternativeSystem = Ashrae621AlternativeSystemService.calculate({
        zones: altZones,
        systemType: input.systemType
      });
      ev = alternativeSystem.ev;
      vou = alternativeSystem.vou;
      statuses.push(alternativeSystem.status);
    }
    
    statuses.push(densityResult.status);
    
    const status = VentilationValidationService.aggregateStatus(statuses);
    
    let votStandard: number | null = null;
    let votDensityCorrected: number | null = null;
    
    if (status !== 'FAIL' && status !== 'INCOMPLETE' && status !== 'NOT_EVALUATED' && ev !== null && ev > 0 && vou !== null) {
      votStandard = vou / ev;
      votDensityCorrected = votStandard * densityResult.eRho;
    }
    
    let finalStatus = status;
    if ((ev === null || ev <= 0) && finalStatus === 'PASS') {
      finalStatus = (input.method === 'Alternative' && ev === null) ? 'NOT_EVALUATED' : 'FAIL';
    }
    
    return {
      zones: zoneResults,
      density: densityResult,
      simplifiedSystem,
      alternativeSystem,
      vou,
      ev,
      votStandard,
      votDensityCorrected,
      finalDesignOutdoorAir: votDensityCorrected,
      revisionState: 'ASHRAE 62.1-2025 Base + Errata',
      status: finalStatus
    };
  }
}
