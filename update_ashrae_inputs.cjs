const fs = require('fs');
let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

if (!file.includes('import ValidatedInput')) {
  file = file.replace(
    /import \{ Ashrae621Service[^\n]+;/g,
    `$&
import ValidatedInput from './ValidatedInput';`
  );
}

// 1. Altitude
file = file.replace(
  /<input type="number" value=\{altitude\} onChange=\{\(e\) => setAltitude\(Number\(e\.target\.value\)\)\} className="[^"]+" \/>/,
  `<ValidatedInput type="number" min={-1000} errorMsg="Altitude must be >= -1000" value={altitude} onChange={(e) => setAltitude(Number(e.target.value))} />`
);

// 2. Air Temp
file = file.replace(
  /<input type="number" value=\{airTemp\} onChange=\{\(e\) => setAirTemp\(Number\(e\.target\.value\)\)\} className="[^"]+" \/>/,
  `<ValidatedInput type="number" min={-60} max={150} errorMsg="Valid range: -60 to 150" value={airTemp} onChange={(e) => setAirTemp(Number(e.target.value))} />`
);

// 3. Zone Area
file = file.replace(
  /<input \n\s*type="number"\n\s*value=\{zr\.input\.area\}\n\s*onChange=\{\(e\) => updateZone\(zr\.input\.id, 'area', Number\(e\.target\.value\)\)\}\n\s*className="[^"]+"\n\s*\/>/g,
  `<ValidatedInput type="number" min={1} errorMsg="Area must be > 0" value={zr.input.area} onChange={(e) => updateZone(zr.input.id, 'area', Number(e.target.value))} />`
);

// 4. Zone Occupants
file = file.replace(
  /<input \n\s*type="number"\n\s*value=\{zr\.input\.occupants\}\n\s*onChange=\{\(e\) => updateZone\(zr\.input\.id, 'occupants', Number\(e\.target\.value\)\)\}\n\s*disabled=\{zr\.input\.useDefaultOccupancy\}\n\s*className="[^"]+"\n\s*\/>/g,
  `<ValidatedInput type="number" min={0} errorMsg="Occupants must be >= 0" value={zr.input.occupants} onChange={(e) => updateZone(zr.input.id, 'occupants', Number(e.target.value))} disabled={zr.input.useDefaultOccupancy} />`
);

// 5. Primary Airflow
file = file.replace(
  /<input \n\s*type="number"\n\s*value=\{zr\.input\.primaryAirflow\}\n\s*onChange=\{\(e\) => updateZone\(zr\.input\.id, 'primaryAirflow', Number\(e\.target\.value\)\)\}\n\s*className="[^"]+"\n\s*\/>/g,
  `<ValidatedInput type="number" min={0} errorMsg="Airflow must be >= 0" value={zr.input.primaryAirflow} onChange={(e) => updateZone(zr.input.id, 'primaryAirflow', Number(e.target.value))} />`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
