const fs = require('fs');
let code = fs.readFileSync('src/components/VoltageDropCalc.tsx', 'utf-8');

if (!code.includes('import TooltipLabel')) {
  code = code.replace(
    `import { Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';`,
    `import { Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';\nimport TooltipLabel from './TooltipLabel';`
  );
}

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">System Voltage (V)</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="System Voltage (V)" tooltip="Line-to-Line voltage for 3-phase, or Line-to-Neutral for 1-phase." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Phase</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Phase" tooltip="Determines the formula multiplier: 2 for 1-phase, √3 (1.732) for 3-phase." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Load Current (A)</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Load Current (A)" tooltip="The continuous design load current flowing through the cable." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Cable Length (m)</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Cable Length (m)" tooltip="One-way physical length of the cable run from source to load." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Resistance (Ω/km)</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Resistance (Ω/km)" tooltip="AC resistance of the cable at operating temperature. Found in manufacturer datasheets." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Reactance (Ω/km)</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Reactance (Ω/km)" tooltip="Inductive reactance of the cable. Crucial for larger cables (usually > 16mm²) where AC skin effect and induction matter." />`
);

fs.writeFileSync('src/components/VoltageDropCalc.tsx', code);
