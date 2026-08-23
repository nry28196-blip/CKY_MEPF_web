import re

with open('src/components/MechanicalCalc.tsx', 'r') as f:
    content = f.read()

# Diversity / Coincidence Factor
div_search = '<span className="text-slate-400 uppercase">Diversity / Coincidence Factor</span>'
div_replace = '<TooltipLabel\n                          label="Diversity / Coincidence Factor"\n                          tooltip="Accounts for non-coincidence of peak loads across multiple zones (Standard: 1.1 - 1.25)." \n                          className="text-slate-400 uppercase"\n                        />'
content = content.replace(div_search, div_replace)

# Total Liquid Piping Length (m)
pipe_search = '<span className="text-slate-400 uppercase">Total Liquid Piping Length (m)</span>'
pipe_replace = '<TooltipLabel\n                         label="Total Liquid Piping Length (m)"\n                         tooltip="Physical length of the main refrigerant liquid line. Impacts additional refrigerant charge." \n                         className="text-slate-400 uppercase"\n                       />'
content = content.replace(pipe_search, pipe_replace)

# Max allowed CR limit (twice)
cr_search = '<span className="text-slate-400 uppercase text-[10px]">Max allowed CR limit</span>'
cr_replace = '<TooltipLabel\n                          label="Max allowed CR limit"\n                          tooltip="Capacity Ratio limit. 130% is standard for VRF to prevent compressor short-cycling and ensure adequate part-load efficiency." \n                          className="text-slate-400 uppercase text-[10px]"\n                        />'
content = content.replace(cr_search, cr_replace)

with open('src/components/MechanicalCalc.tsx', 'w') as f:
    f.write(content)
