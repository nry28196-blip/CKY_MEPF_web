const fs = require('fs');
let code = fs.readFileSync('src/components/ElectricalCalc.tsx', 'utf-8');

if (!code.includes('EngineeringAuditTrail')) {
  code = code.replace(
    "import TooltipLabel from './TooltipLabel';",
    "import TooltipLabel from './TooltipLabel';\nimport EngineeringAuditTrail from './common/EngineeringAuditTrail';"
  );
  
  const trailCode = `
          {/* Audit Trail */}
          <div className="mt-6">
            <EngineeringAuditTrail
              title="Electrical FLC Calculation Audit"
              trail={[
                { symbol: 'P', name: 'Power', value: appliedPower, unit: 'kW' },
                { symbol: 'V', name: 'Voltage', value: appliedVoltage, unit: 'V' },
                { symbol: 'PF', name: 'Power Factor', value: appliedPowerFactor, unit: '' },
                { symbol: 'M', name: 'Phase Multiplier', value: appliedPhase === 'three' ? '√3 (1.732)' : '1', unit: '' },
                { symbol: 'I', name: 'Full Load Current (FLC)', formula: appliedPhase === 'three' ? '(P × 1000) / (V × PF × √3)' : '(P × 1000) / (V × PF)', value: current.toFixed(2), unit: 'A' }
              ]}
            />
          </div>
`;
  code = code.replace(
    "            <div className=\"mt-4 grid grid-cols-2 md:grid-cols-4 gap-4\">\n              <div className=\"bg-slate-950 rounded-lg p-3 border border-slate-800\">\n                <span className=\"block text-[10px] text-slate-500 uppercase font-semibold mb-1\">Min Breaker (1.25x)</span>\n                <span className=\"font-mono font-bold text-slate-300\">{(current * 1.25).toFixed(1)} A</span>\n              </div>\n              <div className=\"bg-slate-950 rounded-lg p-3 border border-slate-800\">\n                <span className=\"block text-[10px] text-slate-500 uppercase font-semibold mb-1\">Motor CB (2.5x max)</span>\n                <span className=\"font-mono font-bold text-slate-300\">{(current * 2.5).toFixed(1)} A</span>\n              </div>\n            </div>\n          </div>",
    "            <div className=\"mt-4 grid grid-cols-2 md:grid-cols-4 gap-4\">\n              <div className=\"bg-slate-950 rounded-lg p-3 border border-slate-800\">\n                <span className=\"block text-[10px] text-slate-500 uppercase font-semibold mb-1\">Min Breaker (1.25x)</span>\n                <span className=\"font-mono font-bold text-slate-300\">{(current * 1.25).toFixed(1)} A</span>\n              </div>\n              <div className=\"bg-slate-950 rounded-lg p-3 border border-slate-800\">\n                <span className=\"block text-[10px] text-slate-500 uppercase font-semibold mb-1\">Motor CB (2.5x max)</span>\n                <span className=\"font-mono font-bold text-slate-300\">{(current * 2.5).toFixed(1)} A</span>\n              </div>\n            </div>\n          </div>\n          " + trailCode
  );
  
  fs.writeFileSync('src/components/ElectricalCalc.tsx', code);
}
