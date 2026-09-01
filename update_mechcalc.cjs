const fs = require('fs');
let file = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

file = file.replace(
  /type SubTab = 'cooling' \| 'ductSizing' \| 'formulas' \| 'ventilation';/,
  "type SubTab = 'cooling' | 'ductSizing' | 'formulas' | 'ventilation' | 'fanDuty';"
);

file = file.replace(
  /import SystemPerformanceCalc from '\.\/SystemPerformanceCalc';/g,
  ""
);

file = file.replace(
  /import VentilationCalc from '\.\/VentilationCalc';/,
  "import VentilationCalc from './VentilationCalc';\nimport SystemPerformanceCalc from './SystemPerformanceCalc';"
);

const newTabHtml = `        <button
          onClick={() => setSubTab('fanDuty')}
          className={\`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 \${
            subTab === 'fanDuty'
              ? 'border-emerald-500 text-emerald-400 font-extrabold bg-emerald-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }\`}
        >
          Fan Duty Point
        </button>
      </div>`;

file = file.replace(
  /        <\/button>\n      <\/div>/,
  "        </button>\n" + newTabHtml
);

file = file.replace(
  /      \) : subTab === 'formulas' \? \(/,
  `      ) : subTab === 'fanDuty' ? (
        <SystemPerformanceCalc qOutdoorAirProp={ventilationLps} />
      ) : subTab === 'formulas' ? (`
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', file);
