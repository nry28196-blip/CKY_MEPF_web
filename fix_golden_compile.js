import fs from 'fs';

const path = 'src/tests/ventilation/golden.test.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    /Ashrae621ExhaustService\.calculate\(\{[\s\n]*exhaustType:/g,
    "Ashrae621ExhaustService.calculate({ expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType:"
);

fs.writeFileSync(path, content);
