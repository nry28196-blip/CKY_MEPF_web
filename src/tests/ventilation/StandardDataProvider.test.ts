import { describe, it, expect } from 'vitest';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';

describe('StandardDataProvider', () => {
  it('should return correct edition data for valid editions', () => {
    const data2019 = StandardDataProvider.get621SpaceTypes('2019');
    expect(data2019.length).toBeGreaterThan(0);
    expect(data2019[0].edition).toBe('2019');

    const data2022 = StandardDataProvider.get621SpaceTypes('2022');
    expect(data2022.length).toBeGreaterThan(0);
    expect(data2022[0].edition).toBe('2022');

    const data2025 = StandardDataProvider.get621SpaceTypes('2025');
    expect(data2025.length).toBeGreaterThan(0);
    expect(data2025[0].edition).toBe('2025');
  });

  it('should throw INVALID_STANDARD_EDITION for unknown editions', () => {
    expect(() => StandardDataProvider.get621SpaceTypes('2030')).toThrowError('INVALID_STANDARD_EDITION');
    expect(() => StandardDataProvider.get621EzValues('2030')).toThrowError('INVALID_STANDARD_EDITION');
    expect(() => StandardDataProvider.get621ExhaustRates('2030')).toThrowError('INVALID_STANDARD_EDITION');
  });
});
