export interface AirBalanceInput {
  qSupply: number;
  qExhaust: number;
  qReturn: number;
  qTransferIn: number;
}

export interface AirBalanceResult {
  qNet: number;
  pressureRelationship: 'Positive' | 'Negative' | 'Neutral';
  transferOut: number;
}

export interface SystemBalanceInput {
  qSupply: number;
  qOutdoorAir: number;
  qReturn: number;
  qExhaust: number;
  buildingVolume: number;
  isMetric: boolean;
}

export interface SystemBalanceResult {
  buildingPressure: 'Positive' | 'Negative' | 'Neutral';
  qRecirculated: number;
  qRelief: number;
  totalExhaustAndRelief: number;
  qNetBuilding: number;
  isValid: boolean;
  warnings: string[];
}

export class AirBalanceService {
  static calculateRoomBalance(input: AirBalanceInput): AirBalanceResult {
    const qNet = (input.qSupply + input.qTransferIn) - (input.qExhaust + input.qReturn);
    
    let pressureRelationship: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
    if (qNet > 0) pressureRelationship = 'Positive';
    else if (qNet < 0) pressureRelationship = 'Negative';

    const transferOut = qNet > 0 ? qNet : 0;

    return {
      qNet,
      pressureRelationship,
      transferOut
    };
  }

  static calculateSystemBalance(input: SystemBalanceInput): SystemBalanceResult {
    const warnings: string[] = [];
    let isValid = true;

    if (input.qOutdoorAir > input.qSupply) {
      warnings.push("Outdoor air exceeds total supply air.");
      isValid = false;
    }

    const qRecirculated = input.qSupply - input.qOutdoorAir;
    
    if (qRecirculated > input.qReturn) {
      warnings.push("Required recirculated air exceeds available return air. Check return duct sizing.");
      isValid = false;
    }

    const qRelief = Math.max(0, input.qReturn - qRecirculated);
    const totalExhaustAndRelief = input.qExhaust + qRelief;
    const qNetBuilding = input.qOutdoorAir - totalExhaustAndRelief;

    let buildingPressure: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
    if (qNetBuilding > 0) buildingPressure = 'Positive';
    else if (qNetBuilding < 0) buildingPressure = 'Negative';

    return {
      buildingPressure,
      qRecirculated,
      qRelief,
      totalExhaustAndRelief,
      qNetBuilding,
      isValid,
      warnings
    };
  }
}
