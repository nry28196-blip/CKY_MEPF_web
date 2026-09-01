const fs = require('fs');

let file = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

file = file.replace(
  /import SystemPerformanceCalc from '\.\/SystemPerformanceCalc';/,
  "import SystemPerformanceCalc from './SystemPerformanceCalc';\nimport AirDensityUtility from './AirDensityUtility';"
);

file = file.replace(
  /const \[ventMode, setVentMode\] = useState/,
  "const [globalAltitude, setGlobalAltitude] = useState<number>(0);\n  const [globalAirTemp, setGlobalAirTemp] = useState<number>(unitSystem === 'metric' ? 20 : 70);\n  const [ventMode, setVentMode] = useState"
);

file = file.replace(
  /<div className="space-y-6">/,
  `<div className="space-y-6">
      <AirDensityUtility 
        altitude={globalAltitude} 
        setAltitude={setGlobalAltitude} 
        airTemp={globalAirTemp} 
        setAirTemp={setGlobalAirTemp} 
      />`
);

file = file.replace(
  /\{ventMode === 'standard' && <Ashrae621VentilationCalc onVentilationChange=\{onVentilationChange\} \/>\}/,
  "{ventMode === 'standard' && <Ashrae621VentilationCalc onVentilationChange={onVentilationChange} globalAltitude={globalAltitude} globalAirTemp={globalAirTemp} />}"
);

file = file.replace(
  /\{ventMode === 'performance' && <SystemPerformanceCalc \/>\}/,
  "{ventMode === 'performance' && <SystemPerformanceCalc globalAltitude={globalAltitude} globalAirTemp={globalAirTemp} />}"
);

fs.writeFileSync('src/components/VentilationCalc.tsx', file);

