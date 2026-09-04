const fs = require('fs');
let code = fs.readFileSync('src/components/FireCalc.tsx', 'utf-8');

if (!code.includes('import TooltipLabel')) {
  code = code.replace(
    `import { useLanguage } from '../lib/translations';`,
    `import { useLanguage } from '../lib/translations';\nimport TooltipLabel from './TooltipLabel';`
  );
}

// Replacements
code = code.replace(
  `<label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">External Hydrants Count</label>`,
  `<TooltipLabel className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" label="External Hydrants Count" tooltip="Number of hydrants in the design area. Flow rates per hydrant vary significantly by standard (NFPA 13 vs BS EN 12845)." />`
);

code = code.replace(
  `<label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Breeching Inlets</label>`,
  `<TooltipLabel className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" label="Breeching Inlets" tooltip="Connections for fire department apparatus. Does not generally add to the base pump demand but dictates Siamese connection sizing." />`
);

code = code.replace(
  `<label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">\n                      Sprinkler K-Factor ({isMetric ? 'Lpm/bar^0.5' : 'GPM/psi^0.5'})\n                    </label>`,
  `<TooltipLabel className="block text-[9px] text-slate-400 font-bold uppercase mb-1" label={\`Sprinkler K-Factor (\${isMetric ? 'Lpm/bar^0.5' : 'GPM/psi^0.5'})\`} tooltip="The discharge coefficient of the sprinkler head. Q = K * sqrt(P). Crucial for establishing exact head flow." />`
);

code = code.replace(
  `<label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">\n                      Design Residual Pressure ({isMetric ? 'bar' : 'psi'})\n                    </label>`,
  `<TooltipLabel className="block text-[9px] text-slate-400 font-bold uppercase mb-1" label={\`Design Residual Pressure (\${isMetric ? 'bar' : 'psi'})\`} tooltip="Minimum operating pressure at the hydraulically most remote sprinkler (NFPA 13 minimum is typically 7 psi / 0.48 bar)." />`
);

code = code.replace(
  `<label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Design Area Heads</label>`,
  `<TooltipLabel className="block text-[9px] text-slate-400 font-bold uppercase mb-1" label="Design Area Heads" tooltip="The number of sprinklers calculated to operate simultaneously in the hydraulically most demanding area." />`
);

code = code.replace(
  `<label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">\n                    Required Flow Duration (Minutes)\n                  </label>`,
  `<TooltipLabel className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" label="Required Flow Duration (Minutes)" tooltip="Standard specific duration (e.g., 30, 60, 90 mins) the water supply must sustain peak flow without replenishment." />`
);

code = code.replace(
  `<label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">\n                    Inside/Outside Hose Stream Allowance ({isMetric ? 'Lpm' : 'GPM'})\n                  </label>`,
  `<TooltipLabel className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" label={\`Inside/Outside Hose Stream Allowance (\${isMetric ? 'Lpm' : 'GPM'})\`} tooltip="Additional water flow reserved for fire department hose streams supplementing the sprinkler demand." />`
);

code = code.replace(
  `<label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">\n                    System Highest Elevation ({isMetric ? 'm' : 'ft'})\n                  </label>`,
  `<TooltipLabel className="block text-[10px] font-bold text-slate-400 mb-2 uppercase" label={\`System Highest Elevation (\${isMetric ? 'm' : 'ft'})\`} tooltip="Vertical lift from the pump centerline to the highest sprinkler/standpipe, used to calculate static head loss." />`
);

code = code.replace(
  `<label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Static Head Friction Loss (%)</label>`,
  `<TooltipLabel className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" label="Static Head Friction Loss (%)" tooltip="An estimated percentage of static head to add as dynamic pipe friction for initial pump sizing." />`
);

fs.writeFileSync('src/components/FireCalc.tsx', code);
