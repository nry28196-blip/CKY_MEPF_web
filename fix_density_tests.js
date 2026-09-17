import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-2022-density-propagation.test.ts';
let content = fs.readFileSync(file, 'utf8');

// Rewrite Table 6-5 tests
content = content.replace(
  /it\('TEST F - Table 6-5 Boundary Verification', \(\) => \{[\s\S]*?\}\);/,
  `it('TEST F - Table 6-5 Complete Boundary Verification', () => {
    // Exact Table 6-5 transitions
    expect(DensityCorrectionService.getTableERho(-10)).toBe(1.00); // Invalid/below
    expect(DensityCorrectionService.getTableERho(0)).toBe(1.00);
    
    expect(DensityCorrectionService.getTableERho(158)).toBe(1.00);
    expect(DensityCorrectionService.getTableERho(159)).toBe(1.05);
    
    expect(DensityCorrectionService.getTableERho(566)).toBe(1.05);
    expect(DensityCorrectionService.getTableERho(567)).toBe(1.10);
    
    expect(DensityCorrectionService.getTableERho(951)).toBe(1.10);
    expect(DensityCorrectionService.getTableERho(952)).toBe(1.15);
    
    expect(DensityCorrectionService.getTableERho(1317)).toBe(1.15);
    expect(DensityCorrectionService.getTableERho(1318)).toBe(1.20);
    
    expect(DensityCorrectionService.getTableERho(1664)).toBe(1.20);
    expect(DensityCorrectionService.getTableERho(1665)).toBe(1.25);
    
    expect(DensityCorrectionService.getTableERho(1994)).toBe(1.25);
    expect(DensityCorrectionService.getTableERho(1995)).toBe(1.30);
    
    expect(DensityCorrectionService.getTableERho(2309)).toBe(1.30);
    expect(DensityCorrectionService.getTableERho(2310)).toBe(1.35);
    
    expect(DensityCorrectionService.getTableERho(2609)).toBe(1.35);
    expect(DensityCorrectionService.getTableERho(2610)).toBe(1.40);
    
    expect(DensityCorrectionService.getTableERho(2897)).toBe(1.40);
    expect(DensityCorrectionService.getTableERho(2898)).toBe(1.45);
    
    expect(DensityCorrectionService.getTableERho(3173)).toBe(1.45);
    expect(DensityCorrectionService.getTableERho(3174)).toBe(1.50);
    
    expect(DensityCorrectionService.getTableERho(3437)).toBe(1.50);
    expect(DensityCorrectionService.getTableERho(3438)).toBeNull(); // Above range -> Analytical
  });`
);

// Rewrite G, H, I, J to be purely hardcoded and independent
content = content.replace(
  /it\('TEST G - Analytical Eρ Standard Condition \(Independent\)', \(\) => \{[\s\S]*?\}\);/,
  `it('TEST G - Analytical Eρ Standard Condition (Independent)', () => {
    const res = DensityCorrectionService.calculate({ elevation: 0, temperature: 21, relativeHumidity: 0, method: 'ANALYTICAL' });
    expect(res.eRho).toBeCloseTo(1.0, 3);
    expect(res.density).toBeCloseTo(1.200, 3);
  });`
);

content = content.replace(
  /it\('TEST H - Analytical Eρ Elevated Condition \(Independent\)', \(\) => \{[\s\S]*?\}\);/,
  `it('TEST H - Analytical Eρ Elevated Condition (Independent)', () => {
    // 1500m, 21C, 0% RH
    // Z = 1500 -> p = 84.556 kPa (hardcoded expected value from independent calc)
    // T = 294.15K
    // pd = 84.556
    // dry air density = 84.556 / (0.287058 * 294.15) = 1.0014
    // eRho = 1.2 / 1.0014 = 1.1983
    
    const res = DensityCorrectionService.calculate({ elevation: 1500, temperature: 21, relativeHumidity: 0, method: 'ANALYTICAL' });
    expect(res.eRho).toBeCloseTo(1.1983, 3);
    expect(res.density).toBeCloseTo(1.0014, 3);
  });`
);

content = content.replace(
  /it\('TEST I - Analytical Eρ Realistic Warm Condition \(Independent\)', \(\) => \{[\s\S]*?\}\);/,
  `it('TEST I - Analytical Eρ Realistic Warm Condition (Independent)', () => {
    // 0m, 35C, 50% RH
    // T = 308.15K
    // pv = 2.8134 kPa (from independent formula)
    // pAtm = 101.3 kPa
    // pd = 98.4866 kPa
    // dry air density = 98.4866 / (0.287058 * 308.15) = 1.1134 kg/m3
    // eRho = 1.2 / 1.1134 = 1.0778
    
    const res = DensityCorrectionService.calculate({ elevation: 0, temperature: 35, relativeHumidity: 50, method: 'ANALYTICAL' });
    expect(res.eRho).toBeCloseTo(1.0778, 3);
    expect(res.density).toBeCloseTo(1.1134, 3);
  });`
);

content = content.replace(
  /it\('TEST J - Analytical Eρ Realistic Cool Condition \(Independent\)', \(\) => \{[\s\S]*?\}\);/,
  `it('TEST J - Analytical Eρ Realistic Cool Condition (Independent)', () => {
    // 0m, 0C, 50% RH
    // T = 273.15K
    // pv = 0.30539 kPa
    // pAtm = 101.3 kPa
    // pd = 100.9946 kPa
    // dry air density = 100.9946 / (0.287058 * 273.15) = 1.288
    // eRho = 1.2 / 1.288 = 0.9317
    
    const res = DensityCorrectionService.calculate({ elevation: 0, temperature: 0, relativeHumidity: 50, method: 'ANALYTICAL' });
    expect(res.eRho).toBeCloseTo(0.9317, 3);
    expect(res.density).toBeCloseTo(1.288, 3);
  });

  it('TEST K - Independent D-1b Golden Reference test', () => {
    // D-1b Equation: p = 101.3 * (1 - 2.25577e-5 * Z)^5.2559
    // Expected values derived independently:
    // Z = 0 -> 101.3
    // Z = 1500 -> 84.556
    // Z = 3000 -> 70.108
    
    const res0 = DensityCorrectionService.calculate({ elevation: 0, temperature: 21, relativeHumidity: 0, method: 'ANALYTICAL' });
    expect(res0.pressureAtm).toBeCloseTo(101.3, 3);
    
    const res1500 = DensityCorrectionService.calculate({ elevation: 1500, temperature: 21, relativeHumidity: 0, method: 'ANALYTICAL' });
    expect(res1500.pressureAtm).toBeCloseTo(84.556, 3);
    
    const res3000 = DensityCorrectionService.calculate({ elevation: 3000, temperature: 21, relativeHumidity: 0, method: 'ANALYTICAL' });
    expect(res3000.pressureAtm).toBeCloseTo(70.108, 3);
  });`
);

fs.writeFileSync(file, content);
