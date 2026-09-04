const fs = require('fs');
let code = fs.readFileSync('src/components/ValidatedInput.tsx', 'utf-8');

if (!code.includes('import TooltipLabel')) {
  code = code.replace(
    `import { AlertCircle } from 'lucide-react';`,
    `import { AlertCircle } from 'lucide-react';\nimport TooltipLabel from './TooltipLabel';`
  );
}

if (!code.includes('tooltip?: React.ReactNode;')) {
  code = code.replace(
    `  label?: string;`,
    `  label?: string;\n  tooltip?: React.ReactNode;`
  );
}

code = code.replace(
  `{label && <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">{label}</label>}`,
  `{label && <TooltipLabel className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" label={label} tooltip={tooltip} />}`
);

code = code.replace(
  `min, max, errorMsg, label, className, containerClassName = "", isMetric, value, ...props`,
  `min, max, errorMsg, label, tooltip, className, containerClassName = "", isMetric, value, ...props`
);

fs.writeFileSync('src/components/ValidatedInput.tsx', code);
