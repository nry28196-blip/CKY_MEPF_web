import re

with open('src/components/DuctSizingCalc.tsx', 'r') as f:
    content = f.read()

# 1. Main Airflow (Q)
content = content.replace(
    '<span className="text-slate-400 font-medium">Main Airflow (Q)</span>',
    '<TooltipLabel label="Main Airflow (Q)" tooltip="Total air volume flow rate entering the main duct branch." className="text-slate-400 font-medium" />'
)

# 2. Friction Loss Rate (F)
content = content.replace(
    '<span className="text-slate-400 font-medium">Friction Loss Rate (F)</span>',
    '<TooltipLabel label="Friction Loss Rate (F)" tooltip="Target pressure drop per unit length. Used in equal friction sizing." className="text-slate-400 font-medium" />'
)

# 3. Max Velocity Limit
content = content.replace(
    '<span className="text-slate-400 font-medium">Max Velocity Limit</span>',
    '<TooltipLabel label="Max Velocity Limit" tooltip="Maximum allowable air velocity to avoid noise and excessive dynamic pressure loss." className="text-slate-400 font-medium" />'
)

# 4. Assigned Duct Height (H)
content = content.replace(
    '<label className="text-xs text-slate-400 font-medium">Assigned Duct Height (H)</label>',
    '<TooltipLabel label="Assigned Duct Height (H)" tooltip="Fixed vertical dimension of rectangular duct. Width will be calculated." className="text-xs text-slate-400 font-medium" />'
)

# 5. System / Duct Type
content = content.replace(
    '<label className="text-xs text-slate-400 font-medium flex items-center justify-between">',
    '<div><TooltipLabel label="System / Duct Type" tooltip="Determines the target reference velocity ranges based on the application." className="text-xs text-slate-400 font-medium mb-1" />'
).replace(
    '<span>System / Duct Type</span>\n                  <span className="text-[10px] text-slate-500 font-normal">For reference guidelines</span>\n                </label>',
    '<span className="text-[10px] text-slate-500 font-normal">For reference guidelines</span></div>'
)

# Make sure TooltipLabel is imported
if 'TooltipLabel' not in content:
    content = content.replace(
        "import TrendVisualizer from './TrendVisualizer';",
        "import TrendVisualizer from './TrendVisualizer';\nimport TooltipLabel from './TooltipLabel';"
    )

with open('src/components/DuctSizingCalc.tsx', 'w') as f:
    f.write(content)
