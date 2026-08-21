const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const targetHeader = `      case 'cooling': {
        const isVolume = currentParams.estimationBasis === 'volume';
        return {
          title: isVolume ? 'Cooling Capacity vs Volume Trends' : 'Cooling Capacity vs Area Trends',
          yAxisLabel: 'Cooling Load (kW)',
          xAxisLabel: isVolume ? 'Room Volume (m³)' : 'Floor Area (m²)',
          description: isVolume
            ? 'Compares volume-based rule-of-thumb HVAC cooling demands (~50W/m³ for offices) to residential and heavy load server/tropical standards.'
            : 'Compares area-based rule-of-thumb HVAC cooling demands (~150W/m² for offices) to residential and heavy load tropical standards.',
          iconColor: 'text-emerald-400',
        };
      }`;

const replacementHeader = `      case 'cooling': {
        const isVolume = currentParams.estimationBasis === 'volume';
        return {
          title: viewType === 'trend' ? 'COOLING CAPACITY VS. AREA TRENDS' : 'ESTIMATED COOLING CAPACITY',
          yAxisLabel: 'Cooling Load (kW)',
          xAxisLabel: isVolume ? 'Room Volume (m³)' : 'Floor Area (m²)',
          description: viewType === 'trend' 
            ? 'Compares the calculated room cooling requirement with selectable area-based benchmark values. Benchmark values are preliminary rule-of-thumb references and are not a substitute for detailed cooling-load calculations.' 
            : 'Visualizes the composition of the total room cooling requirement.',
          iconColor: 'text-emerald-400',
        };
      }`;
      
content = content.replace(targetHeader, replacementHeader);
fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
