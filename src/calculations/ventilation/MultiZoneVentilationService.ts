import { ZoneVentilationResult } from './Ashrae621Service';
import { Ashrae621SimplifiedSystemService } from './Ashrae621SimplifiedSystemService';
import { Ashrae621AlternativeSystemService } from './Ashrae621AlternativeSystemService';
import { AirDensityService } from '../services/AirDensityService';

export interface MultiZoneInput {
  zones: any[];
}

export interface MultiZoneSystemResult {
  vps: number;
  vou: number;
  xs: number;
  zdMax: number;
  ev: number;
  vot: number;
  votActual: number;
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
    method: 'simplified' | 'alternative' = 'alternative'
  ): MultiZoneSystemResult {
    
    if (method === 'simplified') {
       const mappedZones = inputs.zones.map(z => ({
         zoneResult: z.result,
         vpz: z.input.primaryAirflow || 0
       }));
       const res = Ashrae621SimplifiedSystemService.calculate({
         zones: mappedZones,
         systemPopulation
       });
       
       const votActual = AirDensityService.applyDensityCorrection(res.vot, densityRatio);
       return {
         vps: 0,
         vou: res.vou,
         xs: 0,
         zdMax: res.maxZpz,
         ev: res.ev,
         vot: res.vot,
         votActual,
         status: res.status,
         warning: res.warning,
         error: res.error,
         method: 'simplified',
         zones: []
       };
    } else {
       const mappedZones = inputs.zones.map(z => ({
         zoneResult: z.result,
         vpz: z.input.primaryAirflow || 0,
         vpzMin: Number(z.input.vpzMin) || 0
       }));
       const res = Ashrae621AlternativeSystemService.calculate({
         zones: mappedZones,
         systemPopulation,
         vps: systemPrimaryAirflow
       });
       
       const votActual = AirDensityService.applyDensityCorrection(res.vot, densityRatio);
       
       // get max Zpz
       const zdMax = res.zoneResults.reduce((max, zr) => Math.max(max, zr.zpz), 0);
       
       return {
         vps: res.vps,
         vou: res.vou,
         xs: res.xs,
         zdMax: zdMax,
         ev: res.ev,
         vot: res.vot,
         votActual,
         status: res.status,
         warning: res.warning,
         error: res.error,
         method: 'alternative',
         zones: res.zoneResults.map((zr, i) => ({
             zoneId: i.toString(),
             zpz: zr.zpz,
             vpzMin: mappedZones[i].vpzMin,
             voz: mappedZones[i].zoneResult.voz,
             isCritical: Math.abs(zr.zpz - zdMax) < 0.001
         }))
       };
    }
  }
}
