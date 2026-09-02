export type ComplianceStatus = 'PASS' | 'FAIL' | 'INCOMPLETE';

export interface ValidationResult {
  status: ComplianceStatus;
  messages: string[];
}

export interface VentilationValidationParams {
  area: number | '';
  volume: number | '';
  occupants: number | '';
  ventilationLps: number | '';
  outdoorTemp: number | '';
  indoorTemp: number | '';
}

export class VentilationValidator {
  static validate(params: VentilationValidationParams): ValidationResult {
    const messages: string[] = [];
    let status: ComplianceStatus = 'PASS';

    // Check incomplete
    if (
      params.area === '' || 
      params.volume === '' || 
      params.occupants === '' || 
      params.ventilationLps === '' ||
      params.outdoorTemp === '' ||
      params.indoorTemp === ''
    ) {
      return { status: 'INCOMPLETE', messages: ['Missing required inputs for calculation.'] };
    }

    const area = Number(params.area);
    const volume = Number(params.volume);
    const occupants = Number(params.occupants);
    const vent = Number(params.ventilationLps);
    const outTemp = Number(params.outdoorTemp);
    const inTemp = Number(params.indoorTemp);

    if (area <= 0) messages.push('Area must be greater than 0.');
    if (volume <= 0) messages.push('Volume must be greater than 0.');
    if (occupants < 0) messages.push('Occupants cannot be negative.');
    if (vent < 0) messages.push('Ventilation flow rate cannot be negative.');
    if (inTemp < 10 || inTemp > 35) messages.push('Indoor design temperature is outside standard comfort range (10-35°C).');
    if (outTemp < -60 || outTemp > 60) messages.push('Outdoor design temperature is outside standard ambient bounds.');
    
    // Some basic sanity check for required ventilation per person
    // Typical ASHRAE minimum is around 2.5 - 5 L/s per person for standard spaces.
    if (occupants > 0 && vent < (occupants * 2.5)) {
      messages.push('Ventilation flow rate is below recommended minimum per occupant (2.5 L/s).');
    }

    if (messages.length > 0) {
      status = 'FAIL';
    }

    return { status, messages };
  }
}
