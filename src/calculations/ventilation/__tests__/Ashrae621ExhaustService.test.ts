import { describe, it, expect } from 'vitest';
import { Ashrae621ExhaustService, AshraeEdition } from '../Ashrae621ExhaustService';

describe('Ashrae621ExhaustService', () => {
  it('should correctly select 2025 exhaust database', () => {
    const spaces = Ashrae621ExhaustService.getSpaces('2025');
    // 2025 has edu_corridor
    expect(spaces.find(s => s.id === 'edu_corridor')).toBeDefined();
    
    const spaces2019 = Ashrae621ExhaustService.getSpaces('2019');
    expect(spaces2019.find(s => s.id === 'edu_corridor')).toBeUndefined();
  });

  it('should calculate governing requirement properly with local code', () => {
    // Math.max(ashraeReq, imcReq, projectReq, mfgReq) if code adopted
    const result = Ashrae621ExhaustService.calculateSpaceExhaust({
      spaceId: 'bath_public',
      edition: '2025',
      quantity: 2, // 2 fixtures
      projectOverride: 110,
      mfgOverride: 0,
      isMetric: false,
      localCodeAdopted: true
    });
    // ASHRAE/IMC is 50 cfm/fixture -> 100 cfm
    // Project override is 110 cfm
    // Governing should be 110 cfm
    expect(result.ashraeReq).toBe(100);
    expect(result.governingRequired).toBe(110);
    expect(result.governingSource).toBe('Project Override');
  });
});
