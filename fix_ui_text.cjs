const fs = require('fs');

let ashrae = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

// 1. "ASHRAE default occupancy density used."
ashrae = ashrae.replace(
  "                      disabled={zr.input.useDefaultOccupancy}",
  "                      disabled={zr.input.useDefaultOccupancy}\n                    />\n                    {zr.input.useDefaultOccupancy && (\n                      <div className=\"text-[10px] text-amber-500 mt-1 leading-tight\">\n                        ASHRAE default occupancy density used.\n                      </div>\n                    )}"
);
ashrae = ashrae.replace(
  "ASHRAE default occupancy density used.\n                      </div>\n                    )}\n                    />",
  "                    />\n                    {zr.input.useDefaultOccupancy && (\n                      <div className=\"text-[10px] text-amber-500 mt-1 leading-tight\">\n                        ASHRAE default occupancy density used.\n                      </div>\n                    )}"
);

// 2. Global Validation "Not Evaluated" and "Preliminary Compliance Check PASS"
// Find where status is displayed. EngineeringStatusHeader handles this. Let's look at EngineeringStatusHeader.
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', ashrae);

let header = fs.readFileSync('src/components/common/EngineeringStatusHeader.tsx', 'utf-8');
header = header.replace(
  "INCOMPLETE: { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-400', icon: AlertCircle, label: 'INCOMPLETE' }",
  "INCOMPLETE: { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-400', icon: AlertCircle, label: 'Not Evaluated' }"
);
header = header.replace(
  "PASS: { bg: 'bg-emerald-950', border: 'border-emerald-800', text: 'text-emerald-400', icon: CheckCircle2, label: 'PASS' }",
  "PASS: { bg: 'bg-emerald-950', border: 'border-emerald-800', text: 'text-emerald-400', icon: CheckCircle2, label: 'Preliminary Compliance Check PASS' }"
);
fs.writeFileSync('src/components/common/EngineeringStatusHeader.tsx', header);

