import fs from 'fs';

let file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/productionOffice!\.sourceType !== 'VERIFIED'/g, "productionOffice!.verificationStatus !== 'VERIFIED'");
fs.writeFileSync(file, content);

file = 'src/tests/ventilation/data-quality.test.ts';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/sourceType === 'VERIFIED'/g, "verificationStatus === 'VERIFIED'");
content = content.replace(/spaceType\.sourceType === 'VERIFIED'/g, "spaceType.verificationStatus === 'VERIFIED'");
content = content.replace(/ez\.sourceType === 'VERIFIED'/g, "ez.verificationStatus === 'VERIFIED'");
fs.writeFileSync(file, content);

// And exhaust-calculations.test.ts errors:
file = 'src/tests/ventilation/exhaust-calculations.test.ts';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/sourceType: 'PUBLIC_REVIEW_DRAFT'/g, "sourceType: 'PUBLIC_REVIEW_DRAFT',\n      verificationStatus: 'NOT_VERIFIED'");
fs.writeFileSync(file, content);
