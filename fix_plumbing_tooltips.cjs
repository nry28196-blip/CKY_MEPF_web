const fs = require('fs');
let code = fs.readFileSync('src/components/PlumbingCalc.tsx', 'utf-8');

if (!code.includes('import TooltipLabel')) {
  code = code.replace(
    `import { useLanguage } from '../lib/translations';`,
    `import { useLanguage } from '../lib/translations';\nimport TooltipLabel from './TooltipLabel';`
  );
}

// Replacements
code = code.replace(
  `<label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Project Type</label>`,
  `<TooltipLabel className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" label="Project Type" tooltip="Determines peak usage patterns and diversity factors for water demand calculation (e.g., Hunter's Curve probabilities vary by building use)." />`
);

code = code.replace(
  `<label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">People (Occupants)</label>`,
  `<TooltipLabel className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" label="People (Occupants)" tooltip="Total building population used for macroscopic water storage volume calculations." />`
);

code = code.replace(
  `<label className="block text-[10px] font-extrabold text-slate-400 uppercase">Pipe Material</label>`,
  `<TooltipLabel className="block text-[10px] font-extrabold text-slate-400 uppercase" label="Pipe Material" tooltip="Determines the absolute pipe roughness (e.g., PVC is smoother than Cast Iron) used in the Colebrook-White or Hazen-Williams friction equations." />`
);

code = code.replace(
  `<label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Avail. Pressure (bar)</label>`,
  `<TooltipLabel className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" label="Avail. Pressure (bar)" tooltip="Static pressure available at the source connection." />`
);

code = code.replace(
  `<label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Req. Residual (bar)</label>`,
  `<TooltipLabel className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" label="Req. Residual (bar)" tooltip="Minimum pressure required at the furthest/highest fixture for proper operation." />`
);

code = code.replace(
  `<label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Main Pipe Length (m)</label>`,
  `<TooltipLabel className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" label="Main Pipe Length (m)" tooltip="Linear length of the pipe run. Used to calculate friction loss." />`
);

code = code.replace(
  `<label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Elevation Change (m)</label>`,
  `<TooltipLabel className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" label="Elevation Change (m)" tooltip="Vertical rise (+ value) or drop (- value). Used to calculate hydrostatic pressure loss/gain (approx 0.098 bar per meter)." />`
);

code = code.replace(
  `<label className="block text-[10px] font-extrabold text-slate-400 uppercase">Fittings & Valves (Equivalent Length)</label>`,
  `<TooltipLabel className="block text-[10px] font-extrabold text-slate-400 uppercase" label="Fittings & Valves (Equivalent Length)" tooltip="Additional friction from fittings modeled as an equivalent length of straight pipe." />`
);

code = code.replace(
  `<label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Building Occupants Count</label>`,
  `<TooltipLabel className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" label="Building Occupants Count" tooltip="Used to size the water tank based on daily per-capita usage standards." />`
);

code = code.replace(
  `<label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Water Storage Buffer (Days)</label>`,
  `<TooltipLabel className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" label="Water Storage Buffer (Days)" tooltip="The required number of days the tank can supply the building without municipal makeup." />`
);

code = code.replace(
  `<label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Desludging Interval (Years)</label>`,
  `<TooltipLabel className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" label="Desludging Interval (Years)" tooltip="Frequency of tank maintenance. Impacts the required sludge retention volume." />`
);

code = code.replace(
  `<label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Building Static Height (m)</label>`,
  `<TooltipLabel className="block text-[9px] text-slate-400 font-bold uppercase mb-1" label="Building Static Height (m)" tooltip="Determines the hydrostatic pump head (0.098 bar / m)." />`
);

code = code.replace(
  `<label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Friction Loss Allowance (%)</label>`,
  `<TooltipLabel className="block text-[9px] text-slate-400 font-bold uppercase mb-1" label="Friction Loss Allowance (%)" tooltip="An estimated allowance added to the static head to account for dynamic pipe friction during flow." />`
);

fs.writeFileSync('src/components/PlumbingCalc.tsx', code);
