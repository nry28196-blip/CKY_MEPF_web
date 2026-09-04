export interface Ashrae622Input {
  localExhaustDeficit?: number;
  floorArea: number; // m2 or ft2
  bedrooms: number;
  isMetric: boolean;
  qInf: number; // Infiltration
  qReq?: number; // Required extra, defaults to 0
  phi: number; // Infiltration credit factor
  edition: '2019' | '2022' | '2025';
}

export interface Ashrae622Result {
  qTot: number;
  qFan: number;
  qInf: number;
  phi: number;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE';
  warning?: string;
}

export class Ashrae622Service {
  static calculateVentilation(input: Ashrae622Input): Ashrae622Result {
    // Basic calculation for Qtot
    const qTot = input.isMetric
      ? 0.15 * input.floorArea + 3.5 * (input.bedrooms + 1)
      : 0.03 * input.floorArea + 7.5 * (input.bedrooms + 1);
      
    const qReq = input.qReq !== undefined ? input.qReq : 0;
    const effectiveInfiltration = input.qInf - qReq;
    
    let infiltrationCredit = 0;
    let status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE' = 'PASS';
    let warning = undefined;
    
    // Infiltration credit
    if (input.qInf > 0) {
      if (input.edition === '2025') {
        // Just an example placeholder for standard-specific validation
        status = 'WARNING';
        warning = '2025 infiltration credit requires strict verification. Credit applied conditionally.';
      }
      infiltrationCredit = effectiveInfiltration > 0 ? input.phi * effectiveInfiltration : 0;
    }
    
    if (input.localExhaustDeficit === undefined) {
      return {
        qTot: 0, qFan: 0, qInf: input.qInf, phi: input.phi,
        status: 'INCOMPLETE',
        warning: 'Local exhaust deficit parameter is undefined.'
      };
    }
    const deficit = input.localExhaustDeficit;
    const qFan = Math.max(0, qTot + deficit - infiltrationCredit);
    
    return {
      qTot,
      qFan,
      qInf: input.qInf,
      phi: input.phi,
      status,
      warning
    };
  }
}
