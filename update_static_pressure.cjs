const fs = require('fs');

let content = fs.readFileSync('src/components/StaticPressureCalc.tsx', 'utf8');

// 1. Add imports
if (!content.includes('ASHRAE_FITTINGS_DB')) {
  content = content.replace(
    "import { CriticalPathService",
    "import { ASHRAE_FITTINGS_DB } from '../calculations/duct/FittingsDatabase';\nimport { CriticalPathService"
  );
}

// 2. Add Fitting Modal State
if (!content.includes('fittingSelectorOpen')) {
  content = content.replace(
    "const [safetyFactor, setSafetyFactor] = useState<number>(10);",
    "const [safetyFactor, setSafetyFactor] = useState<number>(10);\n  const [fittingSelectorOpen, setFittingSelectorOpen] = useState<{pathId: string, sectionId: string} | null>(null);"
  );
}

// 3. Update Fitting UI to include a button
const fittingTarget = `<div>
                          <label className="block text-[9px] text-slate-500 uppercase">Fittings (ΣC)</label>
                          <input type="number" min="0" step="0.1" value={sec.fittingLossCoeff} onChange={(e) => updateSection(path.id, sec.id, 'fittingLossCoeff', Number(e.target.value))} className="w-full bg-slate-900 text-white rounded px-2 py-1.5 text-xs border border-slate-700" />
                        </div>`;

const fittingReplacement = `<div className="relative">
                          <label className="block text-[9px] text-slate-500 uppercase">Fittings (ΣC)</label>
                          <div className="flex space-x-1">
                            <input type="number" min="0" step="0.1" value={sec.fittingLossCoeff} onChange={(e) => updateSection(path.id, sec.id, 'fittingLossCoeff', Number(e.target.value))} className="w-full bg-slate-900 text-white rounded px-2 py-1.5 text-xs border border-slate-700" />
                            <button onClick={() => setFittingSelectorOpen({pathId: path.id, sectionId: sec.id})} className="bg-sky-900/50 hover:bg-sky-800 text-sky-400 px-2 rounded border border-sky-700/50 flex items-center justify-center">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>`;

content = content.replace(fittingTarget, fittingReplacement);


// 4. Add the Modal JSX at the bottom
const modalJSX = `
      {fittingSelectorOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center">
                <GitBranch className="w-4 h-4 mr-2 text-sky-400" />
                Select ASHRAE Fitting
              </h3>
              <button onClick={() => setFittingSelectorOpen(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-2 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 gap-2 p-2">
                {ASHRAE_FITTINGS_DB.map(fit => (
                  <button 
                    key={fit.id}
                    onClick={() => {
                      const path = paths.find(p => p.id === fittingSelectorOpen.pathId);
                      if (path) {
                        const sec = path.sections.find(s => s.id === fittingSelectorOpen.sectionId);
                        if (sec) {
                          updateSection(path.id, sec.id, 'fittingLossCoeff', Number((sec.fittingLossCoeff + fit.lossCoefficient).toFixed(2)));
                        }
                      }
                      setFittingSelectorOpen(null);
                    }}
                    className="flex justify-between items-center text-left bg-slate-950 hover:bg-slate-800 p-3 rounded-lg border border-slate-800 hover:border-sky-500/50 transition-colors"
                  >
                    <div>
                      <span className="block text-xs font-bold text-white mb-0.5">{fit.name}</span>
                      <span className="block text-[10px] text-slate-500 font-mono">{fit.id} | {fit.description}</span>
                    </div>
                    <div className="text-sky-400 font-mono font-bold text-sm bg-sky-950/30 px-2 py-1 rounded">
                      C = {fit.lossCoefficient}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace("    </div>\n  );\n}", modalJSX + "    </div>\n  );\n}");

fs.writeFileSync('src/components/StaticPressureCalc.tsx', content);
console.log("StaticPressureCalc.tsx updated.");
