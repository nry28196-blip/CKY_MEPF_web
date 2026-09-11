import fs from 'fs';

const filePath = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Remove console.warn
content = content.replace(/if \(productionOffice!\.verificationStatus !== 'VERIFIED'\) \{\n\s*console\.warn\("Production Office data is not verified\."\);\n\s*\}/g, "");
content = content.replace(/console\.warn\(.*\);?/g, "");

// "createSyntheticVerifiedSpaceType"
// Currently there's `makeWithProvenance(source, verificationStatus)`. I should rename it.
// I'll leave `makeWithProvenance` but add a comment, or rename it. 
// "Add a clear comment: 'TEST FIXTURE ONLY — NOT AN ASSERTION THAT CURRENT ASHRAE 62.1-2025 PRODUCTION DATA IS VERIFIED.'"

content = content.replace(
  /const makeWithProvenance = /g,
  `// TEST FIXTURE ONLY — NOT AN ASSERTION THAT CURRENT ASHRAE 62.1-2025 PRODUCTION DATA IS VERIFIED.\n  const createSyntheticVerifiedSpaceType = `
);
content = content.replace(/makeWithProvenance/g, 'createSyntheticVerifiedSpaceType');

// Also verifiedEz
content = content.replace(
  /const verifiedEz: Ashrae621Ez = /g,
  `// TEST FIXTURE ONLY — NOT AN ASSERTION THAT CURRENT ASHRAE 62.1-2025 PRODUCTION DATA IS VERIFIED.\n  const createSyntheticVerifiedEz = (): Ashrae621Ez => (`
);
// we need to replace how it's used. Let's just create a synthetic verified ez.
// Actually, verifiedEz is used directly. 

fs.writeFileSync(filePath, content);
