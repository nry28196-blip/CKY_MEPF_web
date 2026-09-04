const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(
  "{Math.round(zr.result.voz || zr.result.voz)} {flowUnit}",
  "{(zr.result.voz * densityRatio).toFixed(1)} {flowUnit}"
);

code = code.replace(
  "{Math.ceil(zr.result.voz || zr.result.voz).toLocaleString()}",
  "{(zr.result.voz * densityRatio).toFixed(1)}"
);

code = code.replace(
  "<span className=\"text-xs text-slate-500 uppercase tracking-wider\">Ez (Distribution Eff.)</span>\\n                    <span className=\"text-xs font-mono text-slate-400\">{zr.result.ez}</span>\\n                  </div>",
  "<span className=\"text-xs text-slate-500 uppercase tracking-wider\">Ez (Distribution Eff.)</span>\\n                    <span className=\"text-xs font-mono text-slate-400\">{zr.result.ez}</span>\\n                  </div>\\n                  <div className=\"flex justify-between items-center mt-2 pt-2 border-t border-slate-800/50\">\\n                    <span className=\"text-xs text-slate-500 uppercase tracking-wider\">Eρ (Density Ratio)</span>\\n                    <span className=\"text-xs font-mono text-slate-400\">{densityRatio.toFixed(3)}</span>\\n                  </div>"
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
