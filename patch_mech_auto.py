import re

with open('src/components/MechanicalCalc.tsx', 'r') as f:
    content = f.read()

# Auto-Calculate from Canvas
auto_search = '<label htmlFor="auto-calc-piping-toggle" className="text-[9px] text-emerald-400 font-bold uppercase cursor-pointer select-none">Auto-Calculate from Canvas</label>'
auto_replace = '<TooltipLabel\n                           label={<label htmlFor="auto-calc-piping-toggle" className="cursor-pointer">Auto-Calculate from Canvas</label>}\n                           tooltip="Automatically sync piping length from the drawn 2D topology canvas diagram." \n                           className="text-[9px] text-emerald-400 font-bold uppercase select-none"\n                         />'
content = content.replace(auto_search, auto_replace)

with open('src/components/MechanicalCalc.tsx', 'w') as f:
    f.write(content)
