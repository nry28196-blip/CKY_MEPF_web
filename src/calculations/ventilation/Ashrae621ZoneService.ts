export interface ZoneVentilationInput {
  spaceType: any;
  area: number; // internal unit: m²
  designOccupancy: number;
  useDefaultOccupancy: boolean;
  ezConfig: any;
}

export interface ZoneVentilationResult {
  az: number; // m²
  pz: number;
  rp: number; // L/s-person
  ra: number; // L/s-m²
  vbp: number; // L/s
  vba: number; // L/s
  vbz: number; // L/s
  ez: number;
  voz: number; // L/s
  occupancyUsed: number;
  occupancySource: 'design' | 'default';
  warning?: string;
  error?: string;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE';
}

export class Ashrae621ZoneService {
  static calculateZoneVentilation(input: ZoneVentilationInput): ZoneVentilationResult {
    let status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE' = 'PASS';
    
    if (!input.spaceType) {
      return this.emptyResult('INCOMPLETE', 'Space type not selected');
    }
    
    if (input.area < 0) {
      return this.emptyResult('FAIL', 'Area cannot be negative');
    }
    
    if (input.designOccupancy < 0 && !input.useDefaultOccupancy) {
      return this.emptyResult('FAIL', 'Occupancy cannot be negative');
    }

    const rp = input.spaceType.rpMetric || 0;
    const ra = input.spaceType.raMetric || 0;
    
    let pz = input.designOccupancy;
    let occupancySource: 'design' | 'default' = 'design';
    let warning = undefined;
    
    if (input.useDefaultOccupancy) {
      const defaultDensity = input.spaceType.defaultOccupancyMetric || 0;
      // Do not arbitrarily round intermediate occupancy unless required.
      // ASHRAE 62.1 does not mandate rounding Pz for the calculation of Vbz.
      pz = (input.area / 100) * defaultDensity; 
      occupancySource = 'default';
    }

    const vbp = rp * pz;
    const vba = ra * input.area;
    const vbz = vbp + vba;
    
    const ez = input.ezConfig?.ez || 1.0;
    const voz = ez > 0 ? vbz / ez : 0;
    
    if (ez <= 0 || ez > 2.0) {
      status = 'FAIL';
      warning = 'Invalid Ez value';
    }

    return {
      az: input.area,
      pz,
      rp,
      ra,
      vbp,
      vba,
      vbz,
      ez,
      voz,
      occupancyUsed: pz,
      occupancySource,
      warning,
      status
    };
  }

  private static emptyResult(status: any, warning: string): ZoneVentilationResult {
    return {
      az: 0, pz: 0, rp: 0, ra: 0, vbp: 0, vba: 0, vbz: 0, ez: 1, voz: 0, occupancyUsed: 0, occupancySource: 'design',
      status, warning
    };
  }
}
