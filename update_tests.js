import fs from 'fs';

const exhaustPath = 'src/tests/ventilation/exhaust-calculations.test.ts';
let exhaustContent = fs.readFileSync(exhaustPath, 'utf8');

exhaustContent = exhaustContent.replace(
    /Ashrae621ExhaustService\.calculate\(\{ exhaustType,/g,
    "Ashrae621ExhaustService.calculate({ expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType,"
);

exhaustContent = exhaustContent.replace(
    /Ashrae621ExhaustService\.calculate\(\{ exhaustType: null,/g,
    "Ashrae621ExhaustService.calculate({ expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: null,"
);

fs.writeFileSync(exhaustPath, exhaustContent);

const goldenPath = 'src/tests/ventilation/golden.test.ts';
let goldenContent = fs.readFileSync(goldenPath, 'utf8');

goldenContent = goldenContent.replace(
    /Ashrae621ExhaustService\.calculate\(\{ exhaustType:/g,
    "Ashrae621ExhaustService.calculate({ expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType:"
);

fs.writeFileSync(goldenPath, goldenContent);
console.log("Updated tests.");
