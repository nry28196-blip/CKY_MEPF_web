const fs = require('fs');
let code = fs.readFileSync('src/components/ElectricalCalc.tsx', 'utf8');

// 1. Import VoltageDropCalc
code = code.replace(
  /import FormulaVisualizer from '\.\/FormulaVisualizer';/,
  "import FormulaVisualizer from './FormulaVisualizer';\nimport VoltageDropCalc from './VoltageDropCalc';"
);

// 2. Update SubTab type
code = code.replace(
  /type SubTab = 'flc' \| 'ups' \| 'elv_ups' \| 'formulas';/,
  "type SubTab = 'flc' | 'vd' | 'ups' | 'elv_ups' | 'formulas';"
);

// 3. Add to Nav Tabs
const oldNav = `<button
                    onClick={() => setSubTab('formulas')}
                    className={\`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 \${
                      subTab === 'formulas'
                        ? 'border-amber-500 text-amber-400 font-extrabold bg-amber-950/10'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }\`}
                  >
                    References
                  </button>`;
                  
const newNav = `<button
                    onClick={() => setSubTab('vd')}
                    className={\`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 \${
                      subTab === 'vd'
                        ? 'border-amber-500 text-amber-400 font-extrabold bg-amber-950/10'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }\`}
                  >
                    Voltage Drop
                  </button>
                  <button
                    onClick={() => setSubTab('formulas')}
                    className={\`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 \${
                      subTab === 'formulas'
                        ? 'border-amber-500 text-amber-400 font-extrabold bg-amber-950/10'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }\`}
                  >
                    References
                  </button>`;
                  
code = code.replace(oldNav, newNav);

// 4. Add render block
const oldRender = `) : subTab === 'formulas' ? (`;
const newRender = `) : subTab === 'vd' ? (\n            <VoltageDropCalc />\n          ) : subTab === 'formulas' ? (`;
code = code.replace(oldRender, newRender);

fs.writeFileSync('src/components/ElectricalCalc.tsx', code);
console.log("Patched ElectricalCalc for Voltage Drop");
