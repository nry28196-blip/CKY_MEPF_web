const fs = require('fs');
let file = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

if (!file.includes('import ValidatedInput')) {
  file = file.replace(
    /import InputAlert from '.\/InputAlert';/g,
    `$&
import ValidatedInput from './ValidatedInput';`
  );
}

// Write regex carefully, there are many inputs in MechanicalCalc
file = file.replace(
  /<input\s+type="number"\s+value=\{([^}]+)\}\s+onChange=\{\(e\) => ([a-zA-Z]+)\(Number\(e\.target\.value\)\)\}\s+className="[^"]*bg-slate-9[0-5]0[^"]*"\s*\/>/g,
  (match, val, setter) => {
    let min = '0';
    let max = undefined;
    let msg = 'Must be >= 0';
    
    if (val === 'outdoorTemp') { min = '-50'; max = '60'; msg = 'Range: -50 to 60'; }
    if (val === 'indoorTemp') { min = '0'; max = '40'; msg = 'Range: 0 to 40'; }
    if (val === 'height') { min = '1'; msg = 'Height > 0'; }
    if (val === 'wallUValue' || val === 'roofUValue' || val === 'windowUValue') { min = '0.01'; msg = 'U-Value > 0'; }
    if (val === 'windowShgc') { min = '0.01'; max = '1.0'; msg = 'SHGC: 0 to 1.0'; }
    if (val === 'diversityFactor') { min = '0.1'; max = '2.0'; msg = 'Typically 0.7 to 1.3'; }
    if (val === 'pipingLength' || val === 'mainPipingLength' || val === 'customPipesTotal') { min = '0'; msg = 'Length >= 0'; }
    if (val === 'customOduHp') { min = '1'; msg = 'HP >= 1'; }
    
    let maxAttr = max ? ` max={${max}}` : '';
    return `<ValidatedInput type="number" min={${min}}${maxAttr} errorMsg="${msg}" value={${val}} onChange={(e) => ${setter}(Number(e.target.value))} />`;
  }
);

// Specifically handle the Altitude one which is weird:
file = file.replace(
  /<input\s+type="number"\s+disabled=\{!useAltitudeAdj\}\s+value=\{altitude === 0 && !useAltitudeAdj \? '' : altitude\}\s+onChange=\{\(e\) => \{\s+if \(useAltitudeAdj\) setAltitude\(e\.target\.value === '' \? 0 : Number\(e\.target\.value\)\);\s+\}\}\s+placeholder="Altitude"\s+className="[^"]*bg-slate-900[^"]*"\s*\/>/g,
  `<ValidatedInput type="number" disabled={!useAltitudeAdj} min={-1000} errorMsg="Altitude must be >= -1000" value={altitude === 0 && !useAltitudeAdj ? '' : altitude} onChange={(e) => { if (useAltitudeAdj) setAltitude(e.target.value === '' ? 0 : Number(e.target.value)); }} placeholder="Altitude" />`
);

// Specifically handle VRF Room inline inputs
file = file.replace(
  /<input\s+type="number"\s+value=\{r\.size\}\s+onChange=\{\(e\) => updateVrfRoom\(r\.id, 'size', Number\(e\.target\.value\)\)\}\s+className="[^"]*bg-slate-950[^"]*"\s*\/>/g,
  `<ValidatedInput type="number" min={1} errorMsg="Size > 0" value={r.size} onChange={(e) => updateVrfRoom(r.id, 'size', Number(e.target.value))} />`
);

file = file.replace(
  /<input\s+type="number"\s+value=\{r\.occupants\}\s+onChange=\{\(e\) => updateVrfRoom\(r\.id, 'occupants', Number\(e\.target\.value\)\)\}\s+className="[^"]*bg-slate-950[^"]*"\s*\/>/g,
  `<ValidatedInput type="number" min={0} errorMsg="Occupants >= 0" value={r.occupants} onChange={(e) => updateVrfRoom(r.id, 'occupants', Number(e.target.value))} />`
);

file = file.replace(
  /<input\s+type="number"\s+value=\{r\.pipeLength\}\s+onChange=\{\(e\) => updateVrfRoom\(r\.id, 'pipeLength', Number\(e\.target\.value\)\)\}\s+className="[^"]*bg-slate-950[^"]*"\s*\/>/g,
  `<ValidatedInput type="number" min={0} errorMsg="Length >= 0" value={r.pipeLength} onChange={(e) => updateVrfRoom(r.id, 'pipeLength', Number(e.target.value))} />`
);


fs.writeFileSync('src/components/MechanicalCalc.tsx', file);
