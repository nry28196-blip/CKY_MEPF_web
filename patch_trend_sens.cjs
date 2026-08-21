const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const oldBlock = `      case 'cooling': {
        const isVolume = currentParams.estimationBasis === 'volume';
        const occupants = Number(currentParams.occupants) || 5;

        if (isVolume) {
          const volume = Number(currentParams.volume) || 150;
          const maxVol = Math.max(300, volume * 2);
          const steps = 10;
          const stepSize = maxVol / steps;

          for (let i = 0; i <= steps; i++) {
            const v = Math.max(15, Math.round(i * stepSize));
            const lowL = (v * 35 + occupants * 100) / 1000; // kW
            const modL = (v * 50 + occupants * 100) / 1000; // kW
            const highL = (v * 75 + occupants * 100) / 1000; // kW

            list.push({
              roomVolumeM3: v,
              'Standard Residential (kW)': parseFloat(lowL.toFixed(1)),
              'Commercial Office (kW)': parseFloat(modL.toFixed(1)),
              'Tropical Glass Facade (kW)': parseFloat(highL.toFixed(1)),
            });
          }
        } else {
          const area = Number(currentParams.area) || 50;
          const maxArea = Math.max(100, area * 2);
          const steps = 10;
          const stepSize = maxArea / steps;

          for (let i = 0; i <= steps; i++) {
            const a = Math.max(5, Math.round(i * stepSize));
            const lowL = (a * 110 + occupants * 100) / 1000; // kW
            const modL = (a * 150 + occupants * 100) / 1000; // kW
            const highL = (a * 220 + occupants * 100) / 1000; // kW

            list.push({
              areaM2: a,
              'Standard Residential (kW)': parseFloat(lowL.toFixed(1)),
              'Commercial Office (kW)': parseFloat(modL.toFixed(1)),
              'Tropical Glass Facade (kW)': parseFloat(highL.toFixed(1)),
            });
          }
        }
        break;
      }`;

const newBlock = `      case 'cooling': {
        const area = Number(currentParams.area) || 50;
        const maxArea = Math.max(100, area * 2);
        const steps = 10;
        const stepSize = maxArea / steps;
        const res = currentParams.results;
        
        if (!res) {
          // fallback if results aren't passed
          for (let i = 0; i <= steps; i++) {
            list.push({ areaM2: Math.round(i * stepSize), 'Current Design (kW)': 0 });
          }
          break;
        }
        
        const fixedLoad = res.equipmentSensible + res.peopleSensible + res.peopleLatent;

        for (let i = 0; i <= steps; i++) {
          const a = Math.max(5, Math.round(i * stepSize));
          const scaleFactor = a / area;
          
          // Scale components that naturally scale with area
          const areaDependentLoad = 
             (res.lightingSensible + 
              res.wallSensible + 
              res.roofSensible + 
              res.windowCondSensible + 
              res.solarSensible + 
              res.ventSensible + 
              res.ventLatent + 
              res.infiltrationSensible + 
              res.infiltrationLatent) * scaleFactor;
              
          // For sensitivity we show:
          // 1. Current Design (using exact scaled ASHRAE components)
          // 2. High Efficiency (15% reduction in area-dependent load)
          // 3. Poor Insulation (20% increase in area-dependent load)
          
          const currentkW = (fixedLoad + areaDependentLoad) / 1000;
          const highEffkW = (fixedLoad + areaDependentLoad * 0.85) / 1000;
          const poorInskW = (fixedLoad + areaDependentLoad * 1.20) / 1000;

          list.push({
            areaM2: a,
            'Current Design (kW)': parseFloat(currentkW.toFixed(2)),
            'High Efficiency (kW)': parseFloat(highEffkW.toFixed(2)),
            'Poor Envelope (kW)': parseFloat(poorInskW.toFixed(2)),
          });
        }
        break;
      }`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
