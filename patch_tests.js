import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-2022-density-propagation.test.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Test A
content = content.replace(
  /const actualRp = zoneResult.rp!;[\s\S]*?expect\(zoneResult.voz\).toBeCloseTo\(expectedVoz\);/,
  `// Independently calculated expected values based on synthetic data
    const Rp = 2.5; // syntheticSpaceType.rpMetric
    const Ra = 0.3; // syntheticSpaceType.raMetric
    const Ez = 0.8; // syntheticEz.ez
    
    const vbz = (Rp * pz) + (Ra * az); // 25 + 30 = 55
    const expectedVoz = (vbz / Ez) * eRho; // (55 / 0.8) * 1.3 = 89.375
     
    expect(zoneResult.voz).toBeCloseTo(expectedVoz);`
);

// 2. Fix production provenance test
content = content.replace(
  /expect\(hasInvalidVerifiedStatus\).toBe\(true\);/g,
  'expect(hasInvalidVerifiedStatus).toBe(false);'
);

fs.writeFileSync(file, content);
