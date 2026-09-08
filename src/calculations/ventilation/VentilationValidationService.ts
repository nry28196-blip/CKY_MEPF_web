export type ValidationStatus = 'PASS' | 'WARNING' | 'INCOMPLETE' | 'FAIL' | 'NOT_EVALUATED' | 'NOT_VERIFIED';

export class VentilationValidationService {
  static aggregateStatus(statuses: ValidationStatus[]): ValidationStatus {
    if (statuses.length === 0) return 'NOT_EVALUATED';
    
    if (statuses.includes('FAIL')) return 'FAIL';
    if (statuses.includes('NOT_VERIFIED')) return 'NOT_VERIFIED';
    if (statuses.includes('INCOMPLETE')) return 'INCOMPLETE';
    if (statuses.includes('WARNING')) return 'WARNING';
    
    const validStatuses = statuses.filter(s => s !== 'NOT_EVALUATED');
    if (validStatuses.length === 0) return 'NOT_EVALUATED';
    if (statuses.includes('NOT_EVALUATED')) return 'NOT_EVALUATED';
    
    return 'PASS';
  }
}
