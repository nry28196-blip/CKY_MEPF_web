const fs = require('fs');
let code = fs.readFileSync('src/components/IAQCalc.tsx', 'utf-8');

if (!code.includes('import TooltipLabel')) {
  code = code.replace(
    `import ValidatedInput from './ValidatedInput';`,
    `import ValidatedInput from './ValidatedInput';\nimport TooltipLabel from './TooltipLabel';`
  );
}

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Design Population</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Design Population" tooltip="Maximum expected occupancy. Sets the upper boundary for the CO2 concentration curve." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">DCV Current Population</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="DCV Current Population" tooltip="Actual current occupancy for Demand Controlled Ventilation. Dynamically impacts the allowable CO2 setpoint." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">CO₂ Generation Rate ({isMetric ? 'L/s/person' : 'cfm/person'})</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label={\`CO₂ Generation Rate (\${isMetric ? 'L/s/person' : 'cfm/person'})\`} tooltip="Metabolic CO2 generation. Depends on the occupant activity level (e.g., resting, office work, heavy exercise per ASHRAE guidelines)." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Outdoor CO₂ (ppm)</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Outdoor CO₂ (ppm)" tooltip="Baseline outdoor ambient CO2 concentration. Typically 400-500 ppm in urban areas." />`
);

fs.writeFileSync('src/components/IAQCalc.tsx', code);
