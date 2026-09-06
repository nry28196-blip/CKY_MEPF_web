import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { Ashrae621ZoneService, ZoneVentilationInput, ZoneVentilationResult } from './Ashrae621ZoneService';
import { Ashrae621SimplifiedSystemService, SimplifiedSystemInput, SimplifiedSystemResult } from './Ashrae621SimplifiedSystemService';
import { Ashrae621AlternativeSystemService, AlternativeSystemInput, AlternativeSystemResult, AlternativeZoneInput } from './Ashrae621AlternativeSystemService';
import { Ashrae621DensityService, DensityInput, DensityResult } from './Ashrae621DensityService';

export interface SingleZoneInput {
  zone: ZoneVentilationInput;
  density: DensityInput | null;
}

export interface SingleZoneResult {
  zone: ZoneVentilationResult;
  density: DensityResult;
  vozStandard: number; // L/s
  votStandard: number; // L/s (for single zone, Vot = Voz)
  votDensityCorrected: number; // L/s
  finalDesignOutdoorAir: number; // The authoritative final value
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
  vou: number; // Uncorrected outdoor air
  ev: number; // System ventilation efficiency
  votStandard: number; // L/s
  votDensityCorrected: number; // L/s
  finalDesignOutdoorAir: number;
  status: ValidationStatus;
}

export class VentilationEngine {
  
  static runSingleZone(input: SingleZoneInput): SingleZoneResult {
    const zoneResult = Ashrae621ZoneService.calculateZone(input.zone);
    const densityResult = Ashrae621DensityService.calculateDensityCorrection(input.density);
    
    const vozStandard = zoneResult.voz;
    const votStandard = vozStandard; // Ev = 1.0 implicitly for 100% OA single zone directly feeding the space? Wait, standard is Vot = Voz.
    const votDensityCorrected = votStandard * densityResult.eRho;
    
    const statuses = [zoneResult.status];
    const status = VentilationValidationService.aggregateStatus(statuses);
    
    return {
      zone: zoneResult,
      density: densityResult,
      vozStandard,
      votStandard,
      votDensityCorrected,
      finalDesignOutdoorAir: votDensityCorrected,
      status
    };
  }

  static runMultiZone(input: MultiZoneInput): MultiZoneResult {
    const zoneResults = input.zones.map(z => ({
      ...Ashrae621ZoneService.calculateZone(z),
      id: z.id
    }));
    
    const densityResult = Ashrae621DensityService.calculateDensityCorrection(input.density);
    
    let vou = 0;
    for (const z of zoneResults) {
      if (z.status === 'PASS' || z.status === 'WARNING') {
        vou += z.voz;
      }
    }
    
    let ev = 1.0;
    let simplifiedSystem: SimplifiedSystemResult | null = null;
    let alternativeSystem: AlternativeSystemResult | null = null;
    
    const statuses = zoneResults.map(z => z.status);

    if (input.method === 'Simplified') {
      simplifiedSystem = Ashrae621SimplifiedSystemService.calculate({
        zones: zoneResults,
        ps: input.systemPopulation,
        dMode: 'CV' // For simplified, dMode is largely irrelevant to the simple Ev formula in 2025.
      });
      ev = simplifiedSystem.ev;
      statuses.push(simplifiedSystem.status);
    } else {
      const altZones: AlternativeZoneInput[] = input.zones.map((z, idx) => ({
        id: z.id,
        voz: zoneResults[idx].voz,
        vpz: z.vpz,
        vpzMinRequired: zoneResults[idx].voz, // For CV it's Voz. For VAV, it depends on system.
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
      statuses.push(alternativeSystem.status);
    }
    
    if (ev <= 0 || isNaN(ev)) {
      statuses.push('FAIL');
    }
    
    const status = VentilationValidationService.aggregateStatus(statuses);
    
    const votStandard = status === 'FAIL' || ev <= 0 ? 0 : vou / ev;
    const votDensityCorrected = status === 'FAIL' ? 0 : votStandard * densityResult.eRho;
    
    return {
      zones: zoneResults,
      density: densityResult,
      simplifiedSystem,
      alternativeSystem,
      vou,
      ev,
      votStandard,
      votDensityCorrected,
      finalDesignOutdoorAir: status === 'FAIL' ? 0 : votDensityCorrected,
      status
    };
  }
}
