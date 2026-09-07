const fs = require('fs');
let content = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf8');

const additionalClasses = `
import { UnitConversionService } from './UnitConversionService';

export interface CoolingLoadInput {
  isMetric: boolean;
  area: number | '';
  volume: number | '';
  height: number | '';
  occupants: number | '';
  estimationBasis: 'area' | 'volume';
  altitude: number;
  outdoorTemp: number;
  indoorTemp: number;
  relativeHumidity: number;
  indoorRelativeHumidity: number;
  useAltitudeAdj: boolean;
  ventilationLps: number;
  sensiblePerPerson: number;
  latentPerPerson: number;
  lightingWpm2: number;
  equipmentWatts: number;
  wallArea: number;
  wallUValue: number;
  roofArea: number;
  roofUValue: number;
  windowArea: number;
  windowUValue: number;
  windowShgc: number;
  infiltrationACH: number;
  safetyFactor: number;
}

export interface CoolingLoadResult {
  status: ValidationStatus;
  warning?: string;
  peopleSensible: number; peopleLatent: number; lightingSensible: number; equipmentSensible: number;
  wallSensible: number; roofSensible: number; windowCondSensible: number; solarSensible: number;
  ventSensible: number; ventLatent: number; infiltrationSensible: number; infiltrationLatent: number;
  totalSensible: number; totalLatent: number;
  calculatedTotal: number; finalTotal: number;
  watts: number; btu: number; tons: number;
}

export interface VrfRoomInput {
  id: string;
  name: string;
  basis: 'area' | 'volume';
  size: number;
  occupants: number;
  pipeLength?: number;
}

export interface VrfRoomResult extends VrfRoomInput {
  tons: number;
  watts: number;
}

export interface VrfSystemInput {
  rooms: VrfRoomInput[];
  isMetric: boolean;
  diversityFactor: number;
  isOduAuto: boolean;
  customOduHp: number;
  refrigerantType: 'R410A' | 'R32';
  pipingLength: number;
}

export interface VrfSystemResult {
  rooms: VrfRoomResult[];
  totalConnectedTons: number;
  totalConnectedWatts: number;
  totalOccupants: number;
  coincidentTons: number;
  coincidentWatts: number;
  selectedHP: number;
  oduCapacityTons: number;
  oduCapacityWatts: number;
  combinationRatio: number;
  additionalCharge: number;
  deratingFactor: number;
  deratedOduCapacityTons: number;
  capacityDeficit: number;
  hasCapacityDeficit: boolean;
  toxicLimitExceeded: boolean;
  toxicConcentration: number;
  smallestRoomName: string;
  smallestRoomVol: number;
  baseOduCharge: number;
  totalCharge: number;
}

export class MechanicalCoolingEngine {
  static readonly baseLoadPerSqm = 150;
  static readonly baseLoadPerCum = 50;
  static readonly loadPerPerson = 100;

  static calcRoomTonsAndWatts(basis: 'area' | 'volume', size: number, occupants: number, isMetric: boolean) {
    const canonicalSize = isMetric 
      ? size 
      : (basis === 'area' ? UnitConversionService.ft2ToM2(size) : UnitConversionService.ft3ToM3(size));
      
    const watts = (basis === 'area' ? canonicalSize * this.baseLoadPerSqm : canonicalSize * this.baseLoadPerCum) + (occupants * this.loadPerPerson);
    const btu = watts * 3.412142;
    const tons = btu / 12000;
    return { watts, tons };
  }

  static calculateCoolingLoad(input: CoolingLoadInput): CoolingLoadResult {
    const { isMetric, estimationBasis, useAltitudeAdj, safetyFactor } = input;
    
    const numArea = input.area !== '' && input.area !== undefined ? Number(input.area) : NaN;
    const numOccupants = input.occupants !== '' && input.occupants !== undefined ? Number(input.occupants) : NaN;
    const numHeight = input.height !== '' && input.height !== undefined ? Number(input.height) : NaN;
    
    if (isNaN(numArea) || isNaN(numOccupants) || isNaN(numHeight)) {
      return {
        status: 'INCOMPLETE',
        warning: 'Missing or invalid required geometry/occupancy parameters.',
        peopleSensible: 0, peopleLatent: 0, lightingSensible: 0, equipmentSensible: 0,
        wallSensible: 0, roofSensible: 0, windowCondSensible: 0, solarSensible: 0,
        ventSensible: 0, ventLatent: 0, infiltrationSensible: 0, infiltrationLatent: 0, 
        totalSensible: 0, totalLatent: 0,
        calculatedTotal: 0, finalTotal: 0,
        watts: 0, btu: 0, tons: 0
      };
    }

    const canonicalArea = isMetric ? numArea : UnitConversionService.ft2ToM2(numArea);
    const canonicalVolume = estimationBasis === 'volume' 
      ? (isMetric ? (input.volume !== '' ? Number(input.volume) : NaN) : UnitConversionService.ft3ToM3(input.volume !== '' ? Number(input.volume) : NaN))
      : (canonicalArea * numHeight);
    
    const altMeters = isMetric ? input.altitude : UnitConversionService.ftToM(input.altitude);
    const canonicalVentLps = isMetric ? input.ventilationLps : UnitConversionService.cfmToLs(input.ventilationLps);

    const dT = input.outdoorTemp - input.indoorTemp;

    const peopleSensible = numOccupants * input.sensiblePerPerson;
    const peopleLatent = numOccupants * input.latentPerPerson;
    const lightingSensible = canonicalArea * input.lightingWpm2;
    const equipmentSensible = input.equipmentWatts;

    const wallSensible = input.wallArea * input.wallUValue * dT;
    const roofSensible = input.roofArea * input.roofUValue * dT;
    const windowCondSensible = input.windowArea * input.windowUValue * dT;

    const solarIrradiance = 400; // W/m2 peak solar assumption
    const solarSensible = input.windowArea * input.windowShgc * solarIrradiance;

    const outdoorProps = DensityCorrectionService.getAirProperties(altMeters, input.outdoorTemp, input.relativeHumidity);
    const indoorProps = DensityCorrectionService.getAirProperties(altMeters, input.indoorTemp, input.indoorRelativeHumidity);

    const actualAirDensity = useAltitudeAdj ? outdoorProps.densityKgM3 : outdoorProps.standardDensityKgM3;
    const dw = Math.max(0, outdoorProps.humidityRatioKgKg - indoorProps.humidityRatioKgKg);
    const cpAir = 1.026 * actualAirDensity;
    const hfgVapor = 2501 * actualAirDensity;

    const ventM3s = canonicalVentLps / 1000;
    const ventSensible = (cpAir * ventM3s * dT) * 1000;
    const ventLatent = (hfgVapor * ventM3s * dw) * 1000;

    const infiltrationM3s = (input.infiltrationACH * canonicalVolume) / 3600;
    const infiltrationSensible = (cpAir * infiltrationM3s * dT) * 1000;
    const infiltrationLatent = (hfgVapor * infiltrationM3s * dw) * 1000;

    const totalSensible = peopleSensible + lightingSensible + equipmentSensible + wallSensible + roofSensible + windowCondSensible + solarSensible + ventSensible + infiltrationSensible;
    const totalLatent = peopleLatent + ventLatent + infiltrationLatent;
    const calculatedTotal = totalSensible + totalLatent;
    const finalTotal = calculatedTotal * (1 + safetyFactor / 100);

    return {
      status: 'PASS',
      peopleSensible, peopleLatent, lightingSensible, equipmentSensible,
      wallSensible, roofSensible, windowCondSensible, solarSensible,
      ventSensible, ventLatent, infiltrationSensible, infiltrationLatent, 
      totalSensible, totalLatent,
      calculatedTotal, finalTotal,
      watts: finalTotal,
      btu: finalTotal * 3.412142,
      tons: finalTotal / 3516.85284
    };
  }

  static calculateVrfSystem(input: VrfSystemInput): VrfSystemResult {
    let totalConnectedTons = 0;
    let totalConnectedWatts = 0;
    let totalOccupants = 0;
    
    const enrichedRooms = input.rooms.map(r => {
      const loads = this.calcRoomTonsAndWatts(r.basis, r.size, r.occupants, input.isMetric);
      return { ...r, tons: loads.tons, watts: loads.watts };
    });

    enrichedRooms.forEach(r => {
      totalConnectedTons += r.tons;
      totalConnectedWatts += r.watts;
      totalOccupants += r.occupants;
    });

    const coincidentTons = totalConnectedTons / input.diversityFactor;
    const coincidentWatts = totalConnectedWatts / input.diversityFactor;

    const vrfOduSizes = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60];
    const targetHP = coincidentTons / 0.8;
    
    let autoHP = vrfOduSizes[0];
    for (const size of vrfOduSizes) {
      if (size >= targetHP) {
        autoHP = size;
        break;
      }
      autoHP = size;
    }

    const selectedHP = input.isOduAuto ? autoHP : input.customOduHp;
    const oduCapacityTons = selectedHP * 0.8;
    const oduCapacityWatts = selectedHP * 2800; // thermal approx
    const combinationRatio = oduCapacityTons > 0 ? (totalConnectedTons / oduCapacityTons) * 100 : 0;

    const chargePerMeter = input.refrigerantType === 'R32' ? 0.050 : 0.055;
    const additionalCharge = input.pipingLength * chargePerMeter;

    const deratingPercentPerMeter = 0.0015;
    const deratingFactor = Math.max(0.65, 1.0 - Math.max(0, input.pipingLength - 7.5) * deratingPercentPerMeter);
    const deratedOduCapacityTons = oduCapacityTons * deratingFactor;
    const capacityDeficit = coincidentTons - deratedOduCapacityTons;
    const hasCapacityDeficit = capacityDeficit > 0 && input.rooms.length > 0;

    let toxicLimitExceeded = false;
    let toxicConcentration = 0;
    let smallestRoomName = '';
    let smallestRoomVol = 0;
    const baseOduCharge = selectedHP * 0.3;
    const totalCharge = additionalCharge + baseOduCharge;

    if (input.rooms.length > 0) {
      const roomVolumes = input.rooms.map(r => ({
        name: r.name,
        vol: r.basis === 'volume' ? r.size : r.size * 3 // approx 3m height if area
      }));
      const smallestRoom = roomVolumes.reduce((min, curr) => curr.vol < min.vol ? curr : min, roomVolumes[0]);
      smallestRoomName = smallestRoom.name;
      smallestRoomVol = smallestRoom.vol;
      
      const toxicLimit = input.refrigerantType === 'R32' ? 0.3 : 0.44; 
      const smallestRoomVolM3 = input.isMetric ? smallestRoom.vol : UnitConversionService.ft3ToM3(smallestRoom.vol);
      toxicConcentration = smallestRoomVolM3 > 0 ? totalCharge / smallestRoomVolM3 : 0;
      if (toxicConcentration > toxicLimit) {
        toxicLimitExceeded = true;
      }
    }

    return {
      rooms: enrichedRooms,
      totalConnectedTons, totalConnectedWatts, totalOccupants,
      coincidentTons, coincidentWatts, selectedHP,
      oduCapacityTons, oduCapacityWatts, combinationRatio,
      additionalCharge, deratingFactor, deratedOduCapacityTons,
      capacityDeficit, hasCapacityDeficit,
      toxicLimitExceeded, toxicConcentration, smallestRoomName, smallestRoomVol,
      baseOduCharge, totalCharge
    };
  }
}
`;

content = content + "\n" + additionalClasses;
fs.writeFileSync('src/lib/VentilationEngine.ts', content);
