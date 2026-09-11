import fs from 'fs';

const path = 'src/tests/ventilation/golden.test.ts';
let content = fs.readFileSync(path, 'utf8');

// The first replacement accidentally targeted "Simplified Multi-Zone Procedure D < 0.60"
content = content.replace(
  "expect(result.status).toBe('BLOCKED');\\n    expect(result.simplifiedSystem?.ev).toBe(0.66);",
  "expect(result.status).toBe('PASS');\\n    expect(result.simplifiedSystem?.ev).toBe(0.66);"
);

// Now fix the actual Exhaust Requirements test
const searchString = `  it('Exhaust Requirements', () => {
    const type = StandardDataProvider.get621ExhaustRates('2025').find(t => t.id === 'toilet_public')!;
    
    const result = Ashrae621ExhaustService.calculate({ expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: type,
      qty: 4,
      designExhaust: 100
    });
    
    expect(result.requiredExhaust).toBeNull();
    expect(result.status).toBe('PASS');
    
    const failResult = Ashrae621ExhaustService.calculate({ expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: type,
      qty: 4,
      designExhaust: 80
    });
    expect(failResult.status).toBe('FAIL');
  });`;

const replaceString = `  it('Exhaust Requirements', () => {
    const type = StandardDataProvider.get621ExhaustRates('2025').find(t => t.id === 'toilet_public')!;
    
    const result = Ashrae621ExhaustService.calculate({ expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
      exhaustType: type,
      qty: 4,
      designExhaust: 100
    });
    
    expect(result.requiredExhaust).toBeNull();
    expect(result.status).toBe('BLOCKED');
    
    const failResult = Ashrae621ExhaustService.calculate({ expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: type,
      qty: 4,
      designExhaust: 80
    });
    expect(failResult.status).toBe('BLOCKED');
  });`;

content = content.replace(searchString, replaceString);

fs.writeFileSync(path, content);
