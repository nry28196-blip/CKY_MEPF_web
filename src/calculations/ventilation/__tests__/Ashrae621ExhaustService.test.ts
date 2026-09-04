import { describe, it, expect } from 'vitest';
import { Ashrae621ExhaustService } from '../Ashrae621ExhaustService';

describe('Ashrae621ExhaustService', () => {
  it('should use explicit zero if overrides are 0 instead of falling back to default', () => {
    // 0 should not become truthy fallback. 
    const res = Ashrae621ExhaustService.calculateSpaceExhaust({
      spaceId: 'bath_public',
      edition: '2022',
      quantity: 10,
      projectOverride: 0,
      mfgOverride: 0,
      isMetric: true,
      localCodeAdopted: true
    });
    expect(res.projectReq).toBe(0);
    expect(res.mfgReq).toBe(0);
    // Since toilet public ashrae is > 0, governing shouldn't be 0
    expect(res.governingRequired).toBeGreaterThan(0);
  });
  
  it('should correctly identify the governing requirement', () => {
    const res = Ashrae621ExhaustService.calculateSpaceExhaust({
      spaceId: 'art_classroom',
      edition: '2022',
      quantity: 1000,
      projectOverride: 5000, // Higher than ASHRAE/IMC
      isMetric: false,
      localCodeAdopted: true
    });
    expect(res.governingRequired).toBe(5000);
    expect(res.governingSource).toBe('Project Override');
  });

  it('should trigger WARNING if AHJ is unverified', () => {
    const res = Ashrae621ExhaustService.calculateSpaceExhaust({
      spaceId: 'art_classroom',
      edition: '2022',
      quantity: 1000,
      isMetric: false,
      localCodeAdopted: false
    });
    expect(res.status).toBe('WARNING');
    expect(res.warning).toContain('Local/AHJ governing requirement not established');
  });
});
