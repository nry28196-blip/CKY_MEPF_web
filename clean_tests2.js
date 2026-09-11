import fs from 'fs';

const filePath = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/const makeVerified = /g, "// TEST FIXTURE ONLY — NOT AN ASSERTION THAT CURRENT ASHRAE 62.1-2025 PRODUCTION DATA IS VERIFIED.\n  const createSyntheticVerifiedFixture = ");
content = content.replace(/makeVerified\(/g, "createSyntheticVerifiedFixture(");

content = content.replace(/const verifiedOffice/g, "const syntheticVerifiedOffice");
content = content.replace(/verifiedOffice/g, "syntheticVerifiedOffice");

content = content.replace(/const verifiedEz/g, "const syntheticVerifiedEz");
content = content.replace(/verifiedEz/g, "syntheticVerifiedEz");

// Ensure createSyntheticVerifiedSpaceType handles source
content = content.replace(/const createSyntheticVerifiedSpaceType = \(sourceType: any, status: any\)/g, "// TEST FIXTURE ONLY — NOT AN ASSERTION THAT CURRENT ASHRAE 62.1-2025 PRODUCTION DATA IS VERIFIED.\n  const createSyntheticVerifiedSpaceType = (sourceType: any, status: any)");

fs.writeFileSync(filePath, content);
