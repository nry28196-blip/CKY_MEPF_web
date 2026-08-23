import re

with open('src/components/DuctSizingCalc.tsx', 'r') as f:
    content = f.read()

search = """                         <rect x="295" y="50" width="80" height="60" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="6" />
                         <text x="335" y="84" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                           {ductType === 'supply' ? 'Zone / Diffuser' : ductType === 'return' ? 'Return Grille' : 'Hood / Intake'}
                         </text>
                       </g>"""

replacement = """                         <rect x="295" y="50" width="80" height="60" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="6" />
                         <text x="335" y="84" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                           {ductType === 'supply' ? 'Zone / Diffuser' : ductType === 'return' ? 'Return Grille' : 'Hood / Intake'}
                         </text>
                         
                         {/* Terminal Run Interactive Node */}
                         <g className="group cursor-pointer">
                           <circle cx="235" cy="80" r="10" fill="transparent" />
                           <circle cx="235" cy="80" r="3" fill={ductType === 'supply' ? '#38bdf8' : ductType === 'return' ? '#c084fc' : '#fbbf24'} stroke="#0f172a" strokeWidth="1" className="group-hover:scale-150 transition-transform origin-[235px_80px]" />
                           
                           <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow-xl z-50">
                             <rect x="190" y="92" width="90" height="42" fill="#0f172a" stroke="#334155" strokeWidth="1" rx="4" />
                             <text x="197" y="105" fill="#e2e8f0" fontSize="8" fontWeight="bold">Terminal Run</text>
                             <text x="197" y="116" fill="#94a3b8" fontSize="7.5">Size: {lenUnitHook.getDisplayValue(widthMain).toFixed(1)}{lenUnit} x {lenUnitHook.getDisplayValue(ductHeight).toFixed(1)}{lenUnit}</text>
                             <text x="197" y="126" fill="#94a3b8" fontSize="7.5">Vel: {velUnitHook.getDisplayValue(velRectMain).toFixed(0)} {velUnit}</text>
                           </g>
                         </g>
                       </g>"""

if search in content:
    content = content.replace(search, replacement)
    with open('src/components/DuctSizingCalc.tsx', 'w') as f:
        f.write(content)
        print("Patched successfully")
else:
    print("Search string not found")
