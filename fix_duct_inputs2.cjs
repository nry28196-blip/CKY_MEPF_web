const fs = require('fs');
let file = fs.readFileSync('src/components/DuctSizingCalc.tsx', 'utf8');

file = file.replace(
  /<input\s+value=\{flowString\}\s+onChange=\{\(e\) => setFlowString\(e\.target\.value\)\}\s+onBlur=\{handleFlowBlur\}\s+className=\{`[^`]+`\}\s*\/>/g,
  `<ValidatedInput type="number" value={flowString} min={1} errorMsg="Flow must be positive" onChange={(e) => setFlowString(e.target.value)} onBlur={handleFlowBlur} />`
);

file = file.replace(
  /<input\s+value=\{frictionString\}\s+onChange=\{\(e\) => setFrictionString\(e\.target\.value\)\}\s+onBlur=\{handleFrictionBlur\}\s+className=\{`[^`]+`\}\s*\/>/g,
  `<ValidatedInput type="number" value={frictionString} min={0.01} max={5.0} errorMsg="Range: 0.01 - 5.0" onChange={(e) => setFrictionString(e.target.value)} onBlur={handleFrictionBlur} />`
);

file = file.replace(
  /<input\s+value=\{maxVelString\}\s+onChange=\{\(e\) => setMaxVelString\(e\.target\.value\)\}\s+onBlur=\{handleMaxVelBlur\}\s+className=\{`[^`]+`\}\s*\/>/g,
  `<ValidatedInput type="number" value={maxVelString} min={100} errorMsg="Velocity >= 100" onChange={(e) => setMaxVelString(e.target.value)} onBlur={handleMaxVelBlur} />`
);

file = file.replace(
  /<input\s+value=\{widthString\}\s+onChange=\{\(e\) => setWidthString\(e\.target\.value\)\}\s+onBlur=\{handleWidthBlur\}\s+className=\{`[^`]+`\}\s*\/>/g,
  `<ValidatedInput type="number" value={widthString} min={4} errorMsg="Width >= 4" onChange={(e) => setWidthString(e.target.value)} onBlur={handleWidthBlur} />`
);

file = file.replace(
  /<input\s+value=\{b\.flowString\}\s+onChange=\{\(e\) => updateBranchString\(b\.id, e\.target\.value\)\}\s+onBlur=\{\(\) => handleBranchBlur\(b\.id\)\}\s+className=\{`[^`]+`\}\s*\/>/g,
  `<ValidatedInput type="number" value={b.flowString} min={1} errorMsg="Flow >= 1" onChange={(e) => updateBranchString(b.id, e.target.value)} onBlur={() => handleBranchBlur(b.id)} />`
);

fs.writeFileSync('src/components/DuctSizingCalc.tsx', file);
