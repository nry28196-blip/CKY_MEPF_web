const fs = require('fs');
let code = fs.readFileSync('src/components/DuctSizingCalc.tsx', 'utf8');

code = code.replace(
  /\}`\}>\{velUnitHook\.getDisplayValue\(b\.velocityRect\)\.toFixed\(0\)\} FPM<\/span>/g,
  `}\>
                              {b.status === 'danger' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                              {velUnitHook.getDisplayValue(b.velocityRect).toFixed(0)} FPM
                            </span>`
);

fs.writeFileSync('src/components/DuctSizingCalc.tsx', code);
console.log("Patched DuctSizingCalc");
