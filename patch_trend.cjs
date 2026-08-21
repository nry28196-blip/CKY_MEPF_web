const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const oldTrendGen = `      case 'cooling': {
        const occupantWatts = (Number(currentParams.occupants) || 0) * 100;
        const isVolume = currentParams.estimationBasis === 'volume';
        const spaceWatts = isVolume
          ? (Number(currentParams.volume) || 0) * 50
          : (Number(currentParams.area) || 0) * 150;
        return [
          { name: 'Structural', value: spaceWatts * 0.50, color: '#4ade80', display: \`\${(spaceWatts * 0.50).toLocaleString()} W\` },
          { name: 'Lighting', value: spaceWatts * 0.15, color: '#93c5fd', display: \`\${(spaceWatts * 0.15).toLocaleString()} W\` },
          { name: 'Equipment', value: spaceWatts * 0.35, color: '#64748b', display: \`\${(spaceWatts * 0.35).toLocaleString()} W\` },
          { name: 'Occupants', value: occupantWatts * 1.0, color: '#1e293b', display: \`\${(occupantWatts * 1.0).toLocaleString()} W\` }
        ];
      }`;

const newTrendGen = `      case 'cooling': {
        const res = currentParams.results;
        if (!res) return []; // Fallback
        
        return [
          { name: 'People', value: res.peopleSensible + res.peopleLatent, color: '#f43f5e', display: \`\${Math.round(res.peopleSensible + res.peopleLatent).toLocaleString()} W\` },
          { name: 'Lighting', value: res.lightingSensible, color: '#facc15', display: \`\${Math.round(res.lightingSensible).toLocaleString()} W\` },
          { name: 'Equipment', value: res.equipmentSensible, color: '#818cf8', display: \`\${Math.round(res.equipmentSensible).toLocaleString()} W\` },
          { name: 'Envelope', value: res.wallSensible + res.roofSensible + res.windowCondSensible, color: '#4ade80', display: \`\${Math.round(res.wallSensible + res.roofSensible + res.windowCondSensible).toLocaleString()} W\` },
          { name: 'Solar', value: res.solarSensible, color: '#fb923c', display: \`\${Math.round(res.solarSensible).toLocaleString()} W\` },
          { name: 'Ventilation', value: res.ventSensible + res.ventLatent, color: '#38bdf8', display: \`\${Math.round(res.ventSensible + res.ventLatent).toLocaleString()} W\` },
          { name: 'Infiltration', value: res.infiltrationSensible + res.infiltrationLatent, color: '#94a3b8', display: \`\${Math.round(res.infiltrationSensible + res.infiltrationLatent).toLocaleString()} W\` }
        ];
      }`;

content = content.replace(oldTrendGen, newTrendGen);
fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
