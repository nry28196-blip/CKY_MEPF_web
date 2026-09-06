const fs = require('fs');
const file = '/app/applet/src/components/Ashrae621VentilationCalc.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const [altitude, setAltitude] = useState<number>(0);',
  `const spaceTypes = edition === '2019' ? ASHRAE_621_2019_SPACE_TYPES : edition === '2022' ? ASHRAE_621_2022_SPACE_TYPES : ASHRAE_621_2025_SPACE_TYPES;
  const ezValues = edition === '2019' ? ASHRAE_621_2019_EZ_VALUES : edition === '2022' ? ASHRAE_621_2022_EZ_VALUES : ASHRAE_621_2025_EZ_VALUES;

  const [altitude, setAltitude] = useState<number>(0);`
);

content = content.replace(
  'const spaceType = ASHRAE_621_2025_SPACE_TYPES.find(s => s.id === z.spaceTypeId) || null;\n      const ezConfig = ASHRAE_621_2025_EZ_VALUES.find(e => e.id === z.ezId) || null;',
  'const spaceType = spaceTypes.find(s => s.id === z.spaceTypeId) || null;\n      const ezConfig = ezValues.find(e => e.id === z.ezId) || null;'
);

content = content.replace(
  'const spaceType = ASHRAE_621_2025_SPACE_TYPES.find(s => s.id === z.spaceTypeId) || null;\n          const ezConfig = ASHRAE_621_2025_EZ_VALUES.find(e => e.id === z.ezId) || null;',
  'const spaceType = spaceTypes.find(s => s.id === z.spaceTypeId) || null;\n          const ezConfig = ezValues.find(e => e.id === z.ezId) || null;'
);

content = content.replace(
  '}, [zones, systemType, isVAV, alternativeConfig, systemPopulation, altitude, airTemp, isMetric]);',
  '}, [zones, systemType, isVAV, alternativeConfig, systemPopulation, altitude, airTemp, isMetric, spaceTypes, ezValues]);'
);

content = content.replace(
  '{ASHRAE_621_2025_SPACE_TYPES.map(s => (',
  '{spaceTypes.map(s => ('
);

content = content.replace(
  '{ASHRAE_621_2025_EZ_VALUES.map(e => (',
  '{ezValues.map(e => ('
);

fs.writeFileSync(file, content);
