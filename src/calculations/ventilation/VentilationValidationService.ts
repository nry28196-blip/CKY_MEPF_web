export type ValidationStatus = 'PASS' | 'WARNING' | 'INCOMPLETE' | 'FAIL' | 'NOT_EVALUATED';

export class VentilationValidationService {
  /**
   * Aggregates an array of statuses based on the strict hierarchy:
   * FAIL > INCOMPLETE > WARNING > PASS
   * NOT_EVALUATED is treated separately, generally not affecting PASS of evaluated items, 
   * but if it's the only status, returns NOT_EVALUATED.
   */
  static aggregateStatus(statuses: ValidationStatus[]): ValidationStatus {
    if (statuses.length === 0) return 'NOT_EVALUATED';
    
    if (statuses.includes('FAIL')) return 'FAIL';
    if (statuses.includes('INCOMPLETE')) return 'INCOMPLETE';
    if (statuses.includes('WARNING')) return 'WARNING';
    
    const validStatuses = statuses.filter(s => s !== 'NOT_EVALUATED');
    if (validStatuses.length === 0) return 'NOT_EVALUATED';
    
    return 'PASS';
  }
}
