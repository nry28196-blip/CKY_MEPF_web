import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

old_label = '<TooltipLabel label="Required Zone Outdoor Air (Voz)" tooltip="ASHRAE 62.1-2019 Sec 6.2.2.3: Voz represents the total ventilation that must be provided to the zone by the supply system to ensure Vbz is satisfied, accounting for mixing effectiveness (Ez)." className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-0" />'
new_label = '<TooltipLabel label={useTempAdj ? "Required Zone Outdoor Air (Actual Voz)" : "Required Zone Outdoor Air (Standard Voz)"} tooltip="ASHRAE 62.1-2019 Sec 6.2.2.3: Voz represents the total ventilation that must be provided to the zone by the supply system to ensure Vbz is satisfied, accounting for mixing effectiveness (Ez)." className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-0" />'

content = content.replace(old_label, new_label)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
