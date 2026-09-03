const fs = require('fs');
let code = fs.readFileSync('src/components/PlumbingCalc.tsx', 'utf8');

code = code.replace(
  /<span>Calc\. Velocity:<\/span>\n\s*<span className=\{Number\(hydraulicResult\.velocity\) > 2\.5 \? 'text-red-400 font-bold' : 'text-white'\}>\n\s*\{hydraulicResult\.velocity\} m\/s\n\s*<\/span>/g,
  `<span>Calc. Velocity:</span>
                                <span className={Number(hydraulicResult.velocity) > 2.4 ? 'text-red-400 font-bold flex items-center gap-1' : 'text-white'}>
                                  {Number(hydraulicResult.velocity) > 2.4 && <AlertTriangle className="w-3 h-3" />}
                                  {hydraulicResult.velocity} m/s
                                </span>`
);

fs.writeFileSync('src/components/PlumbingCalc.tsx', code);
console.log("Patched PlumbingCalc");
