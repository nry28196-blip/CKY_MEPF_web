const fs = require('fs');
let file = fs.readFileSync('src/components/SystemPerformanceCalc.tsx', 'utf8');

// Add import
if (!file.includes('import ValidatedInput')) {
  file = file.replace(
    /import \{ Ashrae621Service \}.*?;/,
    `$&
import ValidatedInput from './ValidatedInput';`
  );
}

// Replace the inputs
// 1. Outdoor Air
file = file.replace(
  /<input type="number" value=\{qOutdoorAir\} onChange=\{\(e\) => setQOutdoorAir\(Number\(e\.target\.value\)\)\} className="[^"]+" \/>/,
  `<ValidatedInput type="number" min={0} errorMsg="Flow rate must be >= 0" value={qOutdoorAir} onChange={(e) => setQOutdoorAir(Number(e.target.value))} />`
);

// 2. Return Air
file = file.replace(
  /<input type="number" value=\{qReturnAir\} onChange=\{\(e\) => setQReturnAir\(Number\(e\.target\.value\)\)\} className="[^"]+" \/>/,
  `<ValidatedInput type="number" min={0} errorMsg="Flow rate must be >= 0" value={qReturnAir} onChange={(e) => setQReturnAir(Number(e.target.value))} />`
);

// 3. Critical Length
file = file.replace(
  /<input type="number" value=\{criticalDuctLength\} onChange=\{\(e\) => setCriticalDuctLength\(Number\(e\.target\.value\)\)\} className="[^"]+" \/>/,
  `<ValidatedInput type="number" min={1} errorMsg="Length must be >= 1" value={criticalDuctLength} onChange={(e) => setCriticalDuctLength(Number(e.target.value))} />`
);

// 4. Friction
file = file.replace(
  /<input type="number" step="0.01" value=\{ductFrictionRate\} onChange=\{\(e\) => setDuctFrictionRate\(Number\(e\.target\.value\)\)\} className="[^"]+" \/>/,
  `<ValidatedInput type="number" step="0.01" min={0.01} max={5} errorMsg="Standard friction: 0.01 to 5.0" value={ductFrictionRate} onChange={(e) => setDuctFrictionRate(Number(e.target.value))} />`
);

// 5. Fitting Loss
file = file.replace(
  /<input type="number" step="0.1" value=\{fittingLosses\} onChange=\{\(e\) => setFittingLosses\(Number\(e\.target\.value\)\)\} className="[^"]+" \/>/,
  `<ValidatedInput type="number" step="0.1" min={0} errorMsg="Loss must be >= 0" value={fittingLosses} onChange={(e) => setFittingLosses(Number(e.target.value))} />`
);

// 6. Equip Drop
file = file.replace(
  /<input type="number" step="0.1" value=\{equipmentPressureDrop\} onChange=\{\(e\) => setEquipmentPressureDrop\(Number\(e\.target\.value\)\)\} className="[^"]+" \/>/,
  `<ValidatedInput type="number" step="0.1" min={0} errorMsg="Pressure drop must be >= 0" value={equipmentPressureDrop} onChange={(e) => setEquipmentPressureDrop(Number(e.target.value))} />`
);

// 7. Fan Eff
file = file.replace(
  /<input type="number" max="100" min="1" value=\{fanEfficiency\} onChange=\{\(e\) => setFanEfficiency\(Number\(e\.target\.value\)\)\} className="[^"]+" \/>/,
  `<ValidatedInput type="number" min={1} max={100} errorMsg="Efficiency: 1% to 100%" value={fanEfficiency} onChange={(e) => setFanEfficiency(Number(e.target.value))} />`
);

// 8. Motor Eff
file = file.replace(
  /<input type="number" max="100" min="1" value=\{motorEfficiency\} onChange=\{\(e\) => setMotorEfficiency\(Number\(e\.target\.value\)\)\} className="[^"]+" \/>/,
  `<ValidatedInput type="number" min={1} max={100} errorMsg="Efficiency: 1% to 100%" value={motorEfficiency} onChange={(e) => setMotorEfficiency(Number(e.target.value))} />`
);

fs.writeFileSync('src/components/SystemPerformanceCalc.tsx', file);
