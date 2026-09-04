const fs = require('fs');
let code = fs.readFileSync('src/components/SystemPerformanceCalc.tsx', 'utf-8');

if (!code.includes('import TooltipLabel')) {
  code = code.replace(
    `import ValidatedInput from './ValidatedInput';`,
    `import ValidatedInput from './ValidatedInput';\nimport TooltipLabel from './TooltipLabel';`
  );
}

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Critical Length ({lengthUnit})</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label={\`Critical Length (\${lengthUnit})\`} tooltip="The longest or most hydraulically restrictive duct run from the fan to the furthest terminal." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Friction ({frictionUnit})</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label={\`Friction (\${frictionUnit})\`} tooltip="Design friction loss rate per unit length of duct (e.g., typically 0.1 in.wg/100ft or 1.0 Pa/m)." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Fitting Loss ({pressureUnit})</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label={\`Fitting Loss (\${pressureUnit})\`} tooltip="Sum of dynamic pressure drops through all fittings (elbows, transitions) in the critical path." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Equip. Drop ({pressureUnit})</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label={\`Equip. Drop (\${pressureUnit})\`} tooltip="Internal pressure drop of the air handling unit (coils, filters, dampers) at design airflow." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Fan Eff. (%)</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Fan Eff. (%)" tooltip="Aerodynamic efficiency of the fan impeller/housing." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Motor Eff. (%)</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Motor Eff. (%)" tooltip="Electrical to mechanical conversion efficiency of the fan motor." />`
);

fs.writeFileSync('src/components/SystemPerformanceCalc.tsx', code);
