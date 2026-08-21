const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const targetStr = `  } else if (type === 'cooling') {
    const isVolume = currentParams.estimationBasis === 'volume';
    if (isVolume) {
      currentXValue = Number(currentParams.volume) || 150;
    } else {
      currentXValue = Number(currentParams.area) || 50;
    }
    currentYValue = parseFloat((Number(currentParams.calculatedWatts || 0) / 1000).toFixed(2));
    referenceName = 'Active Estimator Load (kW)';
  } else if (type === 'ductSizing') {`;

const replacementStr = `  } else if (type === 'cooling') {
    // Relying on native Line dot rendering for actual and final loads
    currentXValue = null;
    currentYValue = null;
  } else if (type === 'ductSizing') {`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
