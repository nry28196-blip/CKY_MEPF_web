export interface Ashrae622Input {
  floorArea: number;
  bedrooms: number;
  isMetric: boolean;
  qInf: number; // Infiltration
  qReq?: number; // Required extra, defaults to 0
  phi: number; // Infiltration credit factor, typically 1.0 for balanced, less for unbalanced
}

export interface Ashrae622Result {
  qTot: number;
  qFan: number;
  qInf: number;
  phi: number;
}

export class Ashrae622Service {
  static calculateVentilation(input: Ashrae622Input): Ashrae622Result {
    const qTot = input.isMetric
      ? 0.15 * input.floorArea + 3.5 * (input.bedrooms + 1)
      : 0.03 * input.floorArea + 7.5 * (input.bedrooms + 1);
      
    const qReq = input.qReq || 0;
    const effectiveInfiltration = input.qInf - qReq;
    
    // According to 62.2, if effectiveInfiltration is < 0, we don't take a credit
    const infiltrationCredit = effectiveInfiltration > 0 ? input.phi * effectiveInfiltration : 0;
    const qFan = Math.max(0, qTot - infiltrationCredit);

    return {
      qTot,
      qFan,
      qInf: input.qInf,
      phi: input.phi
    };
  }
}
