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

export class AirBalanceService {
  /**
   * Calculates net room pressure based on supply, exhaust, and transfer airflow.
   * Qnet = Qsupply + Qtransfer_in - Qreturn - Qexhaust
   */
  static calculateRoomBalance(input: AirBalanceInput): AirBalanceResult {
    const qTotalIn = input.qSupply + input.qTransferIn;
    const qTotalOut = input.qReturn + input.qExhaust;
    
    // Qnet = Qsupply + Qtransfer_in - Qreturn - Qexhaust
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
}
