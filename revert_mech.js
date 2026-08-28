import fs from 'fs';
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// 1. Remove Exhaust from SubTab
code = code.replace(
  "type SubTab = 'cooling' | 'ductSizing' | 'formulas' | 'ventilation' | 'exhaust';",
  "type SubTab = 'cooling' | 'ductSizing' | 'formulas' | 'ventilation';"
);

// 2. Remove Exhaust from imports
code = code.replace(
  "import VentilationCalc from './VentilationCalc';\nimport ExhaustCalc from './ExhaustCalc';",
  "import VentilationCalc from './VentilationCalc';"
);

// 3. Remove Exhaust Tab Button
const tabTarget = `        <button
          onClick={() => setSubTab('exhaust')}
          className={\`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 \${
            subTab === 'exhaust'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'
          }\`}
        >
          Exhaust
        </button>
        <button
          onClick={() => setSubTab('formulas')}
          className={\`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 \${
            subTab === 'formulas'
              ? 'border-fuchsia-500 text-fuchsia-400'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'
          }\`}
        >
          {t('mechFormulasTitle') || 'Formulas'}
        </button>`;
const tabReplacement = `        <button
          onClick={() => setSubTab('formulas')}
          className={\`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 \${
            subTab === 'formulas'
              ? 'border-fuchsia-500 text-fuchsia-400'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'
          }\`}
        >
          {t('mechFormulasTitle') || 'Formulas'}
        </button>`;

code = code.replace(tabTarget, tabReplacement);

// 4. Remove Render ExhaustCalc
const renderTarget = `{subTab === 'ventilation' ? (
        <VentilationCalc />
      ) : subTab === 'exhaust' ? (
        <ExhaustCalc />
      ) : subTab === 'formulas' ? (`;
const renderReplacement = `{subTab === 'ventilation' ? (
        <VentilationCalc />
      ) : subTab === 'formulas' ? (`;

code = code.replace(renderTarget, renderReplacement);

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
