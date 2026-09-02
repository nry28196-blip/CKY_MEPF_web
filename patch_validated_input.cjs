const fs = require('fs');
let content = fs.readFileSync('src/components/ValidatedInput.tsx', 'utf8');

const target = `const isInvalid = (min !== undefined && numValue < min) || (max !== undefined && numValue > max);`;
const replacement = `const isInvalid = value !== '' && value !== undefined && value !== null && ((min !== undefined && numValue < min) || (max !== undefined && numValue > max));`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/ValidatedInput.tsx', content);
console.log("Patched ValidatedInput");
