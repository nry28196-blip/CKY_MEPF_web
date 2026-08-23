with open('src/components/KitchenVentilationCalc.tsx', 'r') as f:
    content = f.read()

# Replace Hood Configuration TooltipLabel
content = content.replace(
'''              <TooltipLabel
                label="Hood Configuration"
                tooltip="Wall-mounted canopies require less airflow than island canopies due to the wall preventing cross-drafts."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
              />''',
'''              <TooltipLabel
                label="Hood Configuration"
                tooltip="Wall-mounted canopies require less airflow than island canopies due to the wall preventing cross-drafts."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
                status="success"
              />'''
)

# Replace Cooking Duty TooltipLabel
content = content.replace(
'''              <TooltipLabel
                label="Cooking Duty"
                tooltip="Light (ovens, steamers), Medium (griddles, fryers), Heavy (charbroilers), Extra Heavy (solid fuel)."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
              />''',
'''              <TooltipLabel
                label="Cooking Duty"
                tooltip="Light (ovens, steamers), Medium (griddles, fryers), Heavy (charbroilers), Extra Heavy (solid fuel)."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
                status="success"
              />'''
)

# Replace Equipment Bank Length TooltipLabel
content = content.replace(
'''              <TooltipLabel
                label={`Equipment Bank Length (${isMetric ? 'm' : 'ft'})`}
                tooltip="Total length of the cooking equipment line."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
              />''',
'''              <TooltipLabel
                label={`Equipment Bank Length (${isMetric ? 'm' : 'ft'})`}
                tooltip="Total length of the cooking equipment line."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
                status={equipmentLength > 0 ? 'success' : 'error'}
              />'''
)

# Replace Side Overhang TooltipLabel
content = content.replace(
'''              <TooltipLabel
                label={`Side Overhang (${isMetric ? 'm' : 'ft'})`}
                tooltip="Hood extension beyond the equipment on each side (Standard minimum is 6 inches or 0.15m)."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
              />''',
'''              <TooltipLabel
                label={`Side Overhang (${isMetric ? 'm' : 'ft'})`}
                tooltip="Hood extension beyond the equipment on each side (Standard minimum is 6 inches or 0.15m)."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
                status={isOverhangWarning ? 'warning' : 'success'}
              />'''
)

# Replace Target Duct Velocity TooltipLabel
content = content.replace(
'''              <TooltipLabel
                label={`Target Duct Velocity (${isMetric ? 'm/s' : 'FPM'})`}
                tooltip="Code compliance typically requires a minimum grease duct velocity (e.g., 1500 FPM or 7.6 m/s) to keep grease particulates entrained."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
              />''',
'''              <TooltipLabel
                label={`Target Duct Velocity (${isMetric ? 'm/s' : 'FPM'})`}
                tooltip="Code compliance typically requires a minimum grease duct velocity (e.g., 1500 FPM or 7.6 m/s) to keep grease particulates entrained."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
                status={isVelocityWarning ? 'warning' : 'success'}
              />'''
)

with open('src/components/KitchenVentilationCalc.tsx', 'w') as f:
    f.write(content)
