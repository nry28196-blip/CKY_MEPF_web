const fs = require('fs');
let file = fs.readFileSync('src/components/AirBalanceCalc.tsx', 'utf8');

// If there are any linter issues with 'Wind' not being used, I can remove it.
if (file.includes('Wind, ') && !file.includes('<Wind')) {
  file = file.replace('Wind, ', '');
}

fs.writeFileSync('src/components/AirBalanceCalc.tsx', file);
