const fs = require('fs');

let file = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

file = file.replace(/import AirDensityUtility from '\.\/AirDensityUtility';\n?/, '');

file = file.replace(
  /const \[globalAltitude, setGlobalAltitude\] = useState<number>\(0\);\n  const \[globalAirTemp, setGlobalAirTemp\] = useState<number>\(unitSystem === 'metric' \? 20 : 70\);\n  const \[ventMode, setVentMode\] = useState/,
  "const [ventMode, setVentMode] = useState"
);

file = file.replace(
  /<div className="space-y-6">\n      <AirDensityUtility \n        altitude=\{globalAltitude\} \n        setAltitude=\{setGlobalAltitude\} \n        airTemp=\{globalAirTemp\} \n        setAirTemp=\{setGlobalAirTemp\} \n      \/>/,
  `<div className="space-y-6">`
);

file = file.replace(
  /\{ventMode === 'standard' && <Ashrae621VentilationCalc onVentilationChange=\{onVentilationChange\} globalAltitude=\{globalAltitude\} globalAirTemp=\{globalAirTemp\} \/>\}/,
  "{ventMode === 'standard' && <Ashrae621VentilationCalc onVentilationChange={onVentilationChange} />}"
);

fs.writeFileSync('src/components/VentilationCalc.tsx', file);
