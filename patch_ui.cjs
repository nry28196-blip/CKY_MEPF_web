const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

const buttonCode = `
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => exportVentilationToCsv({ isMetric, systemType, result: engineResult, zones })}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
        >
          Export Calculation (CSV)
        </button>
      </div>
      <AuditTrailTable
`;

code = code.replace('<AuditTrailTable', buttonCode);
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
