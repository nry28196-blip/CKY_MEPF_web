const fs = require('fs');
let content = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');

const lines = content.split('\n');

const hoodStart = 116; // 1-indexed 117
const hoodEnd = 231; // 1-indexed 232

const resultsStart = 232; // 1-indexed 233
const resultsEnd = 329; // 1-indexed 330

const muaStart = 330; // 1-indexed 331
const muaEnd = 406; // 1-indexed 407

const hoodBlock = lines.slice(hoodStart, hoodEnd + 1).join('\n');
const resultsBlock = lines.slice(resultsStart, resultsEnd + 1).join('\n');
const muaBlock = lines.slice(muaStart, muaEnd + 1).join('\n');

const newReturn = `  return (
    <div className="space-y-6 animate-fade-in">
${hoodBlock}
${muaBlock}
${resultsBlock}
    </div>
  );
}`;

content = lines.slice(0, 115).join('\n') + '\n' + newReturn;

fs.writeFileSync('src/components/KitchenVentilationCalc.tsx', content);
console.log('Restructured');
