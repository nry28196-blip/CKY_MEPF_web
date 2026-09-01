const fs = require('fs');

let file = fs.readFileSync('src/components/SystemPerformanceCalc.tsx', 'utf8');
const lines = file.split('\n');
const newLines = [];
let skip = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Elevation ({lengthUnit})') || lines[i].includes("Temperature ({isMetric ? '°C' : '°F'})")) {
    // we need to remove the <div> before this line, this line, the input line, and the </div> after it.
    newLines.pop(); // remove the <div>
    skip = 2; // skip the input and the </div>
    continue;
  }
  if (skip > 0) {
    skip--;
    continue;
  }
  newLines.push(lines[i]);
}

fs.writeFileSync('src/components/SystemPerformanceCalc.tsx', newLines.join('\n'));
