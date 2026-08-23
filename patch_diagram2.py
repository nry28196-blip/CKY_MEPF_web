import re

with open('src/components/DuctSizingCalc.tsx', 'r') as f:
    content = f.read()

# We need to replace the schematic block.
# Let's target the exact text from `{/* System Flow Schematic */}` up to `</svg>`

search = """                     {/* Type Badge */}
                     <rect x="290" y="10" width="90" height="20" fill="#0f172a" stroke={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} strokeWidth="1" rx="4" />
                     <text x="335" y="24" fill={ductType === 'supply' ? '#38bdf8' : ductType === 'return' ? '#c084fc' : '#fbbf24'} fontSize="9" textAnchor="middle" fontWeight="bold" letterSpacing="1">
                       {ductType === 'supply' ? 'SUPPLY AIR' : ductType === 'return' ? 'RETURN AIR' : 'EXHAUST AIR'}
                     </text>
                   </svg>"""

replacement = """                     {/* Type Badge */}
                     <rect x="290" y="10" width="90" height="20" fill="#0f172a" stroke={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} strokeWidth="1" rx="4" />
                     <text x="335" y="24" fill={ductType === 'supply' ? '#38bdf8' : ductType === 'return' ? '#c084fc' : '#fbbf24'} fontSize="9" textAnchor="middle" fontWeight="bold" letterSpacing="1">
                       {ductType === 'supply' ? 'SUPPLY AIR' : ductType === 'return' ? 'RETURN AIR' : 'EXHAUST AIR'}
                     </text>

                     {/* INTERACTIVE NODES */}
                     {/* Main Duct Node */}
                     <g className="group cursor-pointer">
                       <circle cx="130" cy="80" r="14" fill="transparent" />
                       <circle cx="130" cy="80" r="4.5" fill={ductType === 'supply' ? '#38bdf8' : ductType === 'return' ? '#c084fc' : '#fbbf24'} stroke="#0f172a" strokeWidth="1.5" className="group-hover:scale-150 transition-transform origin-[130px_80px]" />
                       
                       <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow-xl z-50">
                         <rect x="85" y="92" width="90" height="42" fill="#0f172a" stroke="#334155" strokeWidth="1" rx="4" />
                         <text x="92" y="105" fill="#e2e8f0" fontSize="8" fontWeight="bold">Main Duct</text>
                         <text x="92" y="116" fill="#94a3b8" fontSize="7.5">Size: {lenUnitHook.getDisplayValue(widthMain).toFixed(1)}{lenUnit} x {lenUnitHook.getDisplayValue(ductHeight).toFixed(1)}{lenUnit}</text>
                         <text x="92" y="126" fill="#94a3b8" fontSize="7.5">Vel: {velUnitHook.getDisplayValue(velRectMain).toFixed(0)} {velUnit}</text>
                       </g>
                     </g>

                   </svg>"""

if search in content:
    content = content.replace(search, replacement)
    
    # Now for the branches. Let's find the branch drawing part
    search_branch = """                               <rect x="270" y={yPos - 12} width="65" height="24" fill="#1e293b" stroke="#475569" strokeWidth="1" rx="2" />
                               <text x="302.5" y={yPos + 3} fill="#94a3b8" fontSize="8" textAnchor="middle">Branch {i+1}</text>
                               <text x="235" y={yPos - 6} fill={ductType === 'supply' ? '#38bdf8' : ductType === 'return' ? '#c084fc' : '#fbbf24'} fontSize="8" textAnchor="middle" className="font-mono">{Math.round(branchVal)}</text>
                             </g>"""
    
    replacement_branch = """                               <rect x="270" y={yPos - 12} width="65" height="24" fill="#1e293b" stroke="#475569" strokeWidth="1" rx="2" />
                               <text x="302.5" y={yPos + 3} fill="#94a3b8" fontSize="8" textAnchor="middle">Branch {i+1}</text>
                               <text x="235" y={yPos - 6} fill={ductType === 'supply' ? '#38bdf8' : ductType === 'return' ? '#c084fc' : '#fbbf24'} fontSize="8" textAnchor="middle" className="font-mono">{Math.round(branchVal)}</text>
                               
                               {/* Branch Interactive Node */}
                               <g className="group cursor-pointer">
                                 <circle cx="235" cy={yPos} r="10" fill="transparent" />
                                 <circle cx="235" cy={yPos} r="3" fill={ductType === 'supply' ? '#38bdf8' : ductType === 'return' ? '#c084fc' : '#fbbf24'} stroke="#0f172a" strokeWidth="1" className="group-hover:scale-150 transition-transform" style={{ transformOrigin: `235px ${yPos}px` }} />
                                 
                                 <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow-xl">
                                   <rect x={155} y={yPos + 8} width="85" height="32" fill="#0f172a" stroke="#334155" strokeWidth="1" rx="3" />
                                   <text x={160} y={yPos + 19} fill="#e2e8f0" fontSize="7" fontWeight="bold">Size: {lenUnitHook.getDisplayValue(b.width).toFixed(1)}{lenUnit} x {lenUnitHook.getDisplayValue(b.height).toFixed(1)}{lenUnit}</text>
                                   <text x={160} y={yPos + 29} fill="#94a3b8" fontSize="7">Vel: {velUnitHook.getDisplayValue(b.velocityRect).toFixed(0)} {velUnit}</text>
                                 </g>
                               </g>
                             </g>"""
                             
    content = content.replace(search_branch, replacement_branch)

    # Let's do the single zone (when splitting is off)
    search_single = """                         <rect x="295" y="50" width="80" height="60" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="6" />
                         <text x="335" y="84" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                           {ductType === 'supply' ? 'Zone / Diffuser' : ductType === 'return' ? 'Return Grille' : 'Hood / Intake'}
                         </text>
                       </g>"""

    replacement_single = """                         <rect x="295" y="50" width="80" height="60" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="6" />
                         <text x="335" y="84" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                           {ductType === 'supply' ? 'Zone / Diffuser' : ductType === 'return' ? 'Return Grille' : 'Hood / Intake'}
                         </text>
                       </g>"""
                       
    with open('src/components/DuctSizingCalc.tsx', 'w') as f:
        f.write(content)
        print("Patched successfully")
else:
    print("Search string not found")

