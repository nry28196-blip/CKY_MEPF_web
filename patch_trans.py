import re
with open('src/lib/translations.tsx', 'r') as f:
    c = f.read()
c = c.replace('mechDuctSizingTitle: "Duct Sizing",', 'mechDuctSizingTitle: "Duct Sizing",\n    mechVentilationTitle: "Ventilation System",')
c = c.replace('mechDuctSizingTitle: "ទំហំបំពង់ខ្យល់",', 'mechDuctSizingTitle: "ទំហំបំពង់ខ្យល់",\n    mechVentilationTitle: "ប្រព័ន្ធខ្យល់ចេញចូល",')
with open('src/lib/translations.tsx', 'w') as f:
    f.write(c)
