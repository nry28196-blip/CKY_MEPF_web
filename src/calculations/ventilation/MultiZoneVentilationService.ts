import { ZoneVentilationResult } from './Ashrae621Service';
import { Ashrae621SimplifiedSystemService } from './Ashrae621SimplifiedSystemService';
import { Ashrae621AlternativeSystemService } from './Ashrae621AlternativeSystemService';
import { AirDensityService } from '../services/AirDensityService';
import { UnitConversionService } from '../services/UnitConversionService';

export interface MultiZoneInput {
  zones: any[];
  isVAV?: boolean;
  alternativeConfig?: 'single-supply' | 'secondary-recirculation';
}

export interface MultiZoneSystemResult {
  ps?: number;
  sumPz?: number;
  d?: number;
  vps: number;
  vou: number;
  xs: number;
  zdMax: number;
  ev: number;
  vot: number | null;
  votActual: number | null;
  sumVpzMin?: number;
  sumVpz?: number;
  status?: string;
  warning?: string;
  error?: string;
  method: 'simplified' | 'alternative';
  zones?: any[];
}

export class MultiZoneVentilationService {
  static calculateMultiZoneSystem(
    inputs: MultiZoneInput, 
    systemPopulation: number | null, 
    systemPrimaryAirflow: number | null,
    densityRatio: number,
    method: 'simplified' | 'alternative' = 'alternative',
    isMetric: boolean = true // defaulting to true to not break tests that don't pass it
  ): MultiZoneSystemResult {
    
    // 1. Convert to Canonical Metric
    const canonicalSystemPrimaryAirflow = systemPrimaryAirflow !== null 
      ? (isMetric ? systemPrimaryAirflow : UnitConversionService.cfmToLs(systemPrimaryAirflow)) 
      : null;

    if (method === 'simplified') {
       const mappedZones = inputs.zones.map(z => {
         const vpz = z.input.primaryAirflow !== '' ? Number(z.input.primaryAirflow) : undefined;
         const vpzMin = !inputs.isVAV ? vpz : (z.input.vpzMin !== '' && z.input.vpzMin !== undefined ? Number(z.input.vpzMin) : undefined);
         
         return {
           zoneResult: {
             ...z.result,
             voz: isMetric ? z.result.voz : UnitConversionService.cfmToLs(z.result.voz)
           },
           vpz: vpz !== undefined ? (isMetric ? vpz : UnitConversionService.cfmToLs(vpz)) : undefined,
           vpzMin: vpzMin !== undefined ? (isMetric ? vpzMin : UnitConversionService.cfmToLs(vpzMin)) : undefined
         };
       });

       const res = Ashrae621SimplifiedSystemService.calculate({
         zones: mappedZones,
         systemPopulation,
         isVAV: inputs.isVAV
       });
       
       const votActual = res.vot !== null ? AirDensityService.applyDensityCorrection(res.vot, densityRatio) : null;
       
       // Convert Canonical Output to UI Unit
       const convertOut = (val: number | undefined | null) => {
         if (val === undefined || val === null) return val;
         return isMetric ? val : UnitConversionService.lsToCfm(val);
       };

       return {
         vps: 0,
         vou: convertOut(res.vou) as number,
         xs: 0,
         zdMax: 0, 
         ev: res.ev,
         vot: convertOut(res.vot) as number | null,
         votActual: convertOut(votActual) as number | null,
         status: res.status,
         warning: res.warning,
         error: res.error,
         ps: res.ps,
         sumPz: res.sumPz,
         d: res.d,
         method: 'simplified',
         zones: [],
         sumVpzMin: convertOut(res.sumVpzMin) as number | undefined,
         sumVpz: convertOut(res.sumVpz) as number | undefined
       };
    } else {
       const mappedZones = inputs.zones.map(z => {
         const vpz = z.input.primaryAirflow !== '' ? Number(z.input.primaryAirflow) : undefined;
         const vpzMin = !inputs.isVAV ? vpz : (z.input.vpzMin !== '' && z.input.vpzMin !== undefined ? Number(z.input.vpzMin) : undefined);
         
         return {
           zoneResult: {
             ...z.result,
             voz: isMetric ? z.result.voz : UnitConversionService.cfmToLs(z.result.voz)
           },
           vpz: vpz !== undefined ? (isMetric ? vpz : UnitConversionService.cfmToLs(vpz)) : undefined,
           vpzMin: vpzMin !== undefined ? (isMetric ? vpzMin : UnitConversionService.cfmToLs(vpzMin)) : undefined,
           ep: z.input.ep !== '' && z.input.ep !== undefined ? Number(z.input.ep) : undefined,
           er: z.input.er !== '' && z.input.er !== undefined ? Number(z.input.er) : undefined
         };
       });

       const res = Ashrae621AlternativeSystemService.calculate({
         zones: mappedZones,
         systemPopulation,
         vps: canonicalSystemPrimaryAirflow,
         config: inputs.alternativeConfig || 'single-supply'
       });
       
       const votActual = res.vot !== null ? AirDensityService.applyDensityCorrection(res.vot, densityRatio) : null;
       
       const zdMax = res.zoneResults.reduce((max, zr) => Math.max(max, zr.zpz), 0);
       
       const convertOut = (val: number | undefined | null) => {
         if (val === undefined || val === null) return val;
         return isMetric ? val : UnitConversionService.lsToCfm(val);
       };

       return {
         vps: convertOut(res.vps) as number,
         vou: convertOut(res.vou) as number,
         xs: res.xs,
         zdMax: zdMax,
         ev: res.ev,
         vot: convertOut(res.vot) as number | null,
         votActual: convertOut(votActual) as number | null,
         status: res.status,
         warning: res.warning,
         error: res.error,
         ps: res.ps,
         sumPz: res.sumPz,
         d: res.d,
         method: 'alternative',
         sumVpzMin: convertOut(res.sumVpzMin) as number | undefined,
         sumVpz: convertOut(res.sumVpz) as number | undefined,
         zones: res.zoneResults.map((zr, i) => ({
             zoneId: i.toString(),
             zpz: zr.zpz,
             vpzMin: convertOut(mappedZones[i].vpzMin),
             voz: convertOut(mappedZones[i].zoneResult.voz),
             isCritical: Math.abs(zr.zpz - zdMax) < 0.001,
         }))
       };
    }
  }
}
