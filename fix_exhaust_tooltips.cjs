const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621ExhaustCalc.tsx', 'utf-8');

if (!code.includes('import TooltipLabel')) {
  code = code.replace(
    `import { useLanguage } from '../lib/translations';`,
    `import { useLanguage } from '../lib/translations';\nimport TooltipLabel from './TooltipLabel';`
  );
}

code = code.replace(
  `<label className="block text-[10px] font-bold text-slate-500 uppercase">\n                    Qty ({e.space.ashraeUnit === 'area' ? (isMetric ? 'm²' : 'ft²') : 'units'})\n                  </label>`,
  `<TooltipLabel className="block text-[10px] font-bold text-slate-500 uppercase" label={\`Qty (\${e.space.ashraeUnit === 'area' ? (isMetric ? 'm²' : 'ft²') : 'units'})\`} tooltip="The base physical quantity (e.g., floor area, number of fixtures, or number of appliances) used to calculate the mandatory exhaust flow rate." />`
);

code = code.replace(
  `<label className="block text-[10px] font-bold text-slate-500 uppercase">Project Override</label>`,
  `<TooltipLabel className="block text-[10px] font-bold text-slate-500 uppercase" label="Project Override" tooltip="Allows a custom, project-specific required exhaust flow rate that supersedes ASHRAE/IMC minimums if higher." />`
);

fs.writeFileSync('src/components/Ashrae621ExhaustCalc.tsx', code);
