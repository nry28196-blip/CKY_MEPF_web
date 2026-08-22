import re

with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

old_vbz = '<p className="text-slate-400 text-xs font-medium mb-1">Breathing Zone Outdoor Air (Vbz)</p>'
new_vbz = '<TooltipLabel label="Breathing Zone Outdoor Air (Vbz)" tooltip="ASHRAE 62.1-2019 Sec 6.2.2.1: Vbz represents the ventilation required directly in the breathing zone for occupants, before accounting for distribution losses." className="text-slate-400 text-xs font-medium mb-0" />'

old_voz = '<p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Required Zone Outdoor Air (Voz)</p>'
new_voz = '<TooltipLabel label="Required Zone Outdoor Air (Voz)" tooltip="ASHRAE 62.1-2019 Sec 6.2.2.3: Voz represents the total ventilation that must be provided to the zone by the supply system to ensure Vbz is satisfied, accounting for mixing effectiveness (Ez)." className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-0" />'

content = content.replace(old_vbz, new_vbz)
content = content.replace(old_voz, new_voz)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
