import fs from 'fs';

const path = 'src/tests/ventilation/golden.test.ts';
let content = fs.readFileSync(path, 'utf8');

// Find the Exhaust Requirements test
const testRegex = /it\('Exhaust Requirements', \(\) => \{[\s\S]*?\}\);/;
const match = content.match(testRegex);
if (match) {
    let testBlock = match[0];
    testBlock = testBlock.replace(
        "Ashrae621ExhaustService.calculate({", 
        "Ashrae621ExhaustService.calculate({ expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',"
    );
    testBlock = testBlock.replace("expect(result.requiredExhaust).toBe(100);", "expect(result.requiredExhaust).toBeNull();");
    testBlock = testBlock.replace("expect(result.status).toBe('PASS');", "expect(result.status).toBe('BLOCKED');");
    
    // There is a second calculate call in the same block
    testBlock = testBlock.replace(
        "const result2 = Ashrae621ExhaustService.calculate({",
        "const result2 = Ashrae621ExhaustService.calculate({ expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',"
    );
    testBlock = testBlock.replace("expect(result2.status).toBe('FAIL');", "expect(result2.status).toBe('BLOCKED');");
    
    content = content.replace(testRegex, testBlock);
    fs.writeFileSync(path, content);
    console.log("Updated golden.test.ts");
}
