const fs = require('fs');

let content = fs.readFileSync('src/components/IAQCalc.tsx', 'utf8');

content = content.replace("import ashrae2025Data from '../data/ashrae62_1_2025.json';", "import { StandardDataProvider } from '../data/ventilation/StandardDataProvider';");

const replacement = `
  const aqs = StandardDataProvider.get621AirQualityStandards('2025');
  const minMerv = aqs.filtrationRequirements.minimumMERV;
  const pm25Threshold = aqs.filtrationRequirements.pm25DesignThreshold;
  const exhaustClasses = aqs.exhaustClasses;
`;

content = content.replace(
  /  const minMerv = ashrae2025Data\.airQualityStandards\.filtrationRequirements\.minimumMERV;\n  const pm25Threshold = ashrae2025Data\.airQualityStandards\.filtrationRequirements\.pm25DesignThreshold;\n  const exhaustClasses = ashrae2025Data\.airQualityStandards\.exhaustClasses;/g,
  replacement
);

fs.writeFileSync('src/components/IAQCalc.tsx', content);

