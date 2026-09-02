const fs = require('fs');
let file = fs.readFileSync('src/components/DuctSizingCalc.tsx', 'utf8');

if (!file.includes('import ValidatedInput')) {
  file = file.replace(
    /import InputAlert from '\.\/InputAlert';/g,
    `$&
import ValidatedInput from './ValidatedInput';`
  );
}

// 1. Flow input (flowString)
file = file.replace(
  /<input\n\s*value=\{flowString\}\n\s*onChange=\{\(e\) => setFlowString\(e\.target\.value\)\}\n\s*onBlur=\{handleFlowBlur\}\n\s*className="[^"]*"/g,
  `<ValidatedInput value={flowString} min={1} errorMsg="Flow must be positive" onChange={(e) => setFlowString(e.target.value)} onBlur={handleFlowBlur} />`
);

// 2. Friction input (frictionString)
file = file.replace(
  /<input\n\s*value=\{frictionString\}\n\s*onChange=\{\(e\) => setFrictionString\(e\.target\.value\)\}\n\s*onBlur=\{handleFrictionBlur\}\n\s*className="[^"]*"/g,
  `<ValidatedInput value={frictionString} min={0.01} max={5.0} errorMsg="Range: 0.01 - 5.0" onChange={(e) => setFrictionString(e.target.value)} onBlur={handleFrictionBlur} />`
);

// 3. Max Velocity (maxVelString)
file = file.replace(
  /<input\n\s*value=\{maxVelString\}\n\s*onChange=\{\(e\) => setMaxVelString\(e\.target\.value\)\}\n\s*onBlur=\{handleMaxVelBlur\}\n\s*className="[^"]*"/g,
  `<ValidatedInput value={maxVelString} min={100} errorMsg="Velocity >= 100" onChange={(e) => setMaxVelString(e.target.value)} onBlur={handleMaxVelBlur} />`
);

// 4. Custom Width
file = file.replace(
  /<input\n\s*value=\{widthString\}\n\s*onChange=\{\(e\) => setWidthString\(e\.target\.value\)\}\n\s*onBlur=\{handleWidthBlur\}\n\s*className="[^"]*"/g,
  `<ValidatedInput value={widthString} min={4} errorMsg="Width >= 4" onChange={(e) => setWidthString(e.target.value)} onBlur={handleWidthBlur} />`
);

// 5. Branch flow
file = file.replace(
  /<input\n\s*value=\{b\.flowString\}\n\s*onChange=\{\(e\) => updateBranchString\(b\.id, e\.target\.value\)\}\n\s*onBlur=\{\(\) => handleBranchBlur\(b\.id\)\}\n\s*className="[^"]*"/g,
  `<ValidatedInput value={b.flowString} min={1} errorMsg="Flow >= 1" onChange={(e) => updateBranchString(b.id, e.target.value)} onBlur={() => handleBranchBlur(b.id)} />`
);

fs.writeFileSync('src/components/DuctSizingCalc.tsx', file);
