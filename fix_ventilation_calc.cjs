const fs = require('fs');

let file = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

if (!file.includes('SystemPerformanceCalc')) {
  file = file.replace(
    /import AirBalanceCalc from '\.\/AirBalanceCalc';/,
    `import AirBalanceCalc from './AirBalanceCalc';\nimport SystemPerformanceCalc from './SystemPerformanceCalc';`
  );
  
  file = file.replace(
    /const \[ventMode, setVentMode\] = useState<'standard' \| 'exhaust' \| 'balance' \| 'kitchen' \| 'residential'>\('standard'\);/,
    `const [ventMode, setVentMode] = useState<'standard' | 'exhaust' | 'balance' | 'kitchen' | 'residential' | 'performance'>('standard');`
  );
  
  const balanceBtn = `<button
            type="button"
            onClick={() => setVentMode('balance')}
            className={\`px-3 py-1.5 rounded-lg transition-all cursor-pointer \${
              ventMode === 'balance' ? 'bg-emerald-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
            }\`}
          >
            Air Balance
          </button>`;
          
  const perfBtn = `${balanceBtn}
          <button
            type="button"
            onClick={() => setVentMode('performance')}
            className={\`px-3 py-1.5 rounded-lg transition-all cursor-pointer \${
              ventMode === 'performance' ? 'bg-amber-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
            }\`}
          >
            System Performance
          </button>`;
          
  file = file.replace(balanceBtn, perfBtn);
  
  file = file.replace(
    /\{ventMode === 'residential' && <ResidentialVentilationCalc \/>\}/,
    `{ventMode === 'residential' && <ResidentialVentilationCalc />}\n        {ventMode === 'performance' && <SystemPerformanceCalc />}`
  );
  
  fs.writeFileSync('src/components/VentilationCalc.tsx', file);
}
