const fs = require('fs');

let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// Update Zone display to show Voz Actual
file = file.replace(
  /<span className="block text-\[9px\] text-slate-500 uppercase">Vbz \/ Ez = Voz<\/span>\n\s+<span className="font-mono text-sky-400 font-bold">\{Math\.round\(zr\.result\.voz\)\} \{flowUnit\}<\/span>/,
  `<span className="block text-[9px] text-slate-500 uppercase">Vbz / Ez = Voz (Std)</span>
                  <span className="font-mono text-sky-400 font-bold">{Math.round(zr.result.voz)} {flowUnit}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase">Voz (Actual)</span>
                  <span className="font-mono text-indigo-400 font-bold">{Math.round(zr.result.vozActual || zr.result.voz)} {flowUnit}</span>`
);

// Update System display to show Vot Actual
file = file.replace(
  /<div className="mt-4 pt-4 border-t border-slate-800">/,
  `<div className="grid grid-cols-2 gap-4 mt-4 mb-2">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Total Vot (Standard)</span>
              <span className="font-mono text-xl text-sky-400 font-bold">{Math.round(systemResult.vot)} {flowUnit}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Total Vot (Actual @ Eρ)</span>
              <span className="font-mono text-xl text-indigo-400 font-bold">{Math.round(systemResult.votActual || systemResult.vot)} {flowUnit}</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800">`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
