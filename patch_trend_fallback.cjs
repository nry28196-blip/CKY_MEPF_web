const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const target = `const fixedLoad = res.equipmentSensible + res.peopleSensible + res.peopleLatent;`;

const replacement = `if (res.equipmentSensible === undefined) {
          // Fallback for old saved state format
          for (let i = 0; i <= steps; i++) {
            list.push({ areaM2: Math.round(i * stepSize), 'Current Design (kW)': 0 });
          }
          break;
        }
        
        const fixedLoad = res.equipmentSensible + res.peopleSensible + res.peopleLatent;`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
