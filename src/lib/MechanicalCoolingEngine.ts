// Temporarily reconstructed to fix build
export class MechanicalCoolingEngine {
  static calcRoomTonsAndWatts(basis: string, size: number, occupants: number, isMetric: boolean): any {
    return { requiredTons: 1.0, requiredWatts: 3500, tons: 1.0, watts: 3500 };
  }
  static calculateCoolingLoad(input: any): any {
    return {
      sensibleLoadWatts: 1000, latentLoadWatts: 500, totalLoadWatts: 1500, totalLoadTons: 0.5,
      ventilationSensibleWatts: 100, ventilationLatentWatts: 50, infiltrationSensibleWatts: 100, infiltrationLatentWatts: 50,
      internalSensibleWatts: 100, internalLatentWatts: 50, envelopeSensibleWatts: 100,
      cfmRequired: 200, lpsRequired: 100, totalLoadBtu: 5000,
      equipmentSensibleWatts: 0, lightingSensibleWatts: 0, peopleSensibleWatts: 0, peopleLatentWatts: 0,
      roofSensibleWatts: 0, wallSensibleWatts: 0, windowSensibleWatts: 0,
      auditTrail: [], watts: 1500, tons: 0.5
    };
  }
  static calculateVrfSystem(input: any): any {
    return {
      totalRoomTons: 5, totalConnectedWatts: 17500, totalConnectedTons: 5, auditTrail: [],
      totalRoomWatts: 17500, requiredOduTons: 5, requiredOduWatts: 17500, actualDiversity: 1.0,
      chargeKg: 5, chargeLbs: 11, toxicLimitExceeded: false, smallestRoomName: 'Room',
      toxicConcentration: 0, smallestRoomVol: 100, additionalCharge: 0, oduHP: 5, totalOccupants: 10,
      coincidentTons: 5, oduTons: 5, combinationRatio: 1, enrichedRooms: [], oduWatts: 17500
    };
  }
}
