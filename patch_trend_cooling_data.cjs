const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const targetState = `  const [viewType, setViewType] = useState<'trend' | 'results'>('trend');`;
const replacementState = `  const [viewType, setViewType] = useState<'trend' | 'results'>('trend');
  const [coolingBenchmarks, setCoolingBenchmarks] = useState([
    { id: 1, value: 100, enabled: true },
    { id: 2, value: 120, enabled: true },
    { id: 3, value: 150, enabled: true },
    { id: 4, value: 180, enabled: true },
    { id: 5, value: 200, enabled: true }
  ]);`;
content = content.replace(targetState, replacementState);

const targetCase = /case 'cooling': \{[\s\S]*?break;\s*\}/;
const replacementCase = `case 'cooling': {
        const area = Number(currentParams.area) || 50;
        const maxArea = Math.max(100, area * 2);
        const steps = 10;
        const stepSize = maxArea / steps;
        const res = currentParams.results;
        
        for (let i = 0; i <= steps; i++) {
          const a = Math.max(5, Math.round(i * stepSize));
          if (a === area) continue; // We add the exact area point below
          
          const point: any = { areaM2: a };
          coolingBenchmarks.filter(b => b.enabled).forEach(b => {
             point[\`\${b.value} W/m² Benchmark\`] = parseFloat((a * b.value / 1000).toFixed(2));
          });
          list.push(point);
        }
        
        const exactPoint: any = { areaM2: area };
        coolingBenchmarks.filter(b => b.enabled).forEach(b => {
             exactPoint[\`\${b.value} W/m² Benchmark\`] = parseFloat((area * b.value / 1000).toFixed(2));
        });
        
        if (res && res.calculatedTotal !== undefined) {
           const actualKw = res.calculatedTotal / 1000;
           const finalKw = res.finalTotal / 1000;
           exactPoint['Actual Calculated Load'] = parseFloat(actualKw.toFixed(3));
           exactPoint['Final Design Load'] = parseFloat(finalKw.toFixed(3));
           exactPoint['Actual Load Density (W/m²)'] = Math.round(res.calculatedTotal / area);
           exactPoint['Final Load Density (W/m²)'] = Math.round(res.finalTotal / area);
        }
        
        list.push(exactPoint);
        list.sort((a, b) => a.areaM2 - b.areaM2);
        
        break;
      }`;
content = content.replace(targetCase, replacementCase);
fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
