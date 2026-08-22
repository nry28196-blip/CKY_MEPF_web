import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "Activity, AlertTriangle } from 'lucide-react';",
    "Activity, AlertTriangle, ArrowDown } from 'lucide-react';"
)

old_blocks = """                <div className="bg-slate-950/50 border border-slate-800/50 rounded-xl p-4 relative overflow-hidden">
                  <TooltipLabel label="Breathing Zone Outdoor Air (Vbz)" tooltip="ASHRAE 62.1-2019 Sec 6.2.2.1: Vbz represents the ventilation required directly in the breathing zone for occupants, before accounting for distribution losses." className="text-slate-400 text-xs font-medium mb-0" />
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-slate-300">{Math.ceil(vbz).toLocaleString()}</span>
                    <span className="text-slate-500 text-sm font-semibold">{flowUnit}</span>
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden group">"""

new_blocks = """                <div className="bg-slate-950/50 border border-slate-800/50 rounded-xl p-4 relative overflow-hidden">
                  <TooltipLabel label="Breathing Zone Outdoor Air (Vbz)" tooltip="ASHRAE 62.1-2019 Sec 6.2.2.1: Vbz represents the ventilation required directly in the breathing zone for occupants, before accounting for distribution losses." className="text-slate-400 text-xs font-medium mb-0" />
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-slate-300">{Math.ceil(vbz).toLocaleString()}</span>
                    <span className="text-slate-500 text-sm font-semibold">{flowUnit}</span>
                  </div>
                </div>

                <div className="flex justify-center -my-3 relative z-10 pointer-events-none">
                  <div className="bg-emerald-950/80 backdrop-blur-sm border-[3px] border-slate-900 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center space-x-1">
                    <span>÷ Ez ({zoneEz})</span>
                    <ArrowDown className="w-3 h-3" />
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden group">"""

# For safety because of whitespace variations, we can just search and replace using regex
content = re.sub(
    r'(<div className="bg-slate-950/50[^>]+>.*?</div>)\s*(<div className="bg-slate-950 border border-slate-800[^>]+>)',
    r'\1\n\n                <div className="flex justify-center -my-5 relative z-10 pointer-events-none">\n                  <div className="bg-emerald-950/80 backdrop-blur-sm border-[4px] border-slate-900 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center space-x-1">\n                    <span>÷ Ez ({zoneEz})</span>\n                    <ArrowDown className="w-3 h-3" />\n                  </div>\n                </div>\n\n                \2',
    content,
    flags=re.DOTALL
)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
