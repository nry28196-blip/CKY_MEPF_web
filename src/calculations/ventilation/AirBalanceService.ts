export interface AirBalanceInput {
  qSupply: number;
  qExhaust: number;
  qReturn: number;
  qTransferIn: number;
}

export interface AirBalanceResult {
  qNet: number; 
  transferOut: number; 
  transferInRequired: number;
  pressureRelationship: 'Positive' | 'Neutral' | 'Negative';
}

export interface SystemBalanceInput {
  qSupply: number;
  qOutdoorAir: number;
  qReturn: number;
  qExhaust: number;
}

export interface SystemBalanceResult {
  qRecirculated: number;
  qRelief: number;
  qNetBuilding: number;
  totalExhaustAndRelief: number;
  buildingPressure: 'Positive' | 'Neutral' | 'Negative';
  isValid: boolean;
  warnings: string[];
}

export class AirBalanceService {
  /**
   * Calculates net room pressure based on supply, exhaust, and transfer airflow.
   * Qnet = Qsupply + Qtransfer_in - Qreturn - Qexhaust
   */
  static calculateRoomBalance(input: AirBalanceInput): AirBalanceResult {
    const qTotalIn = input.qSupply + input.qTransferIn;
    const qTotalOut = input.qReturn + input.qExhaust;
    
    const qNet = qTotalIn - qTotalOut;
    
    let pressureRelationship: 'Positive' | 'Neutral' | 'Negative' = 'Neutral';
    let transferOut = 0;
    let transferInRequired = 0;
    
    if (qNet > 0.1) {
      pressureRelationship = 'Positive';
      transferOut = qNet;
    } else if (qNet < -0.1) {
      pressureRelationship = 'Negative';
      transferInRequired = Math.abs(qNet);
    }
    
    return {
      qNet,
      transferOut,
      transferInRequired,
      pressureRelationship
    };
  }

  /**
   * Calculates building and system level air balance relationships.
   */
  static calculateSystemBalance(input: SystemBalanceInput): SystemBalanceResult {
    const warnings: string[] = [];
    let isValid = true;

    // Recirculated air is Supply minus Outdoor Air
    const qRecirculated = input.qSupply - input.qOutdoorAir;
    if (qRecirculated < 0) {
      isValid = false;
      warnings.push("Outdoor Air exceeds Total Supply Air. System impossible.");
    }

    // Relief air is Return minus Recirculated Air
    let qRelief = input.qReturn - qRecirculated;
    if (qRelief < 0) {
      warnings.push("Return Air is less than required Recirculated Air. System will starve for air or draw unconditioned infiltration.");
      qRelief = 0; // Can't have negative relief
    }

    // Total air leaving the building mechanically (Local Exhaust + Unit Relief)
    const totalExhaustAndRelief = input.qExhaust + qRelief;

    // Building Net Flow = Air brought in (OA) - Air mechanically exhausted (Exhaust + Relief)
    const qNetBuilding = input.qOutdoorAir - totalExhaustAndRelief;

    let buildingPressure: 'Positive' | 'Neutral' | 'Negative' = 'Neutral';
    if (qNetBuilding > 0.1) {
      buildingPressure = 'Positive';
    } else if (qNetBuilding < -0.1) {
      buildingPressure = 'Negative';
      warnings.push("Building is negatively pressurized. Infiltration will occur.");
    }

    // Typical rule of thumb: Building should be slightly positive (e.g. OA = Exhaust + 10%)
    // But we'll just flag if it's too positive or negative.
    if (buildingPressure === 'Positive' && qNetBuilding > (input.qSupply * 0.15)) {
        warnings.push("Building is highly pressurized. Check for excessive exfiltration or ensure doors can close.");
    }

    return {
      qRecirculated: Math.max(0, qRecirculated),
      qRelief,
      qNetBuilding,
      totalExhaustAndRelief,
      buildingPressure,
      isValid,
      warnings
    };
  }
}
