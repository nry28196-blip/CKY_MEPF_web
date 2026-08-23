import re

with open('src/components/DuctSizingCalc.tsx', 'r') as f:
    content = f.read()

# I want to add the SVG schematic rendering.
# Where is a good place?
# "Visual Chart for Section Distribution" is at the bottom of the right panel.
# Let's insert the schematic before the Visual Chart for Section Distribution, or before the cross-section SVG.
# Let's place it right above the `<!-- Duct visual cross-section representation -->`

search = "{/* Duct visual cross-section representation using dynamic SVG shape */}"

schematic = """
              {/* System Flow Schematic */}
              <div className="bg-slate-950/60 border border-slate-850/80 rounded-xl p-5 flex flex-col min-h-[220px] relative overflow-hidden">
                 <span className="absolute top-3 left-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono z-10">System Flow Schematic</span>
                 
                 <div className="w-full flex-1 flex items-center justify-center mt-6">
                   <svg viewBox="0 0 400 160" className="w-full h-auto drop-shadow-md">
                     <defs>
                       <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                         <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.3"/>
                       </pattern>
                     </defs>
                     
                     <rect width="400" height="160" fill="url(#gridPattern)" rx="8" />
                     
                     {/* Left Box */}
                     <rect x="20" y="50" width="70" height="60" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="6" />
                     <text x="55" y="84" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                        {ductType === 'supply' ? 'AHU / RTU' : ductType === 'return' ? 'AHU / RTU' : 'Exhaust Fan'}
                     </text>
                     
                     {/* Main Airflow */}
                     <path d="M 90 80 L 170 80" fill="none" 
                           stroke={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} 
                           strokeWidth="16" opacity="0.7" />
                     {ductType === 'supply' ? (
                       <polygon points="155,68 175,80 155,92" fill={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} />
                     ) : (
                       <polygon points="105,68 85,80 105,92" fill={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} />
                     )}
                     
                     <text x="130" y="65" fill={ductType === 'supply' ? '#38bdf8' : ductType === 'return' ? '#c084fc' : '#fbbf24'} fontSize="12" textAnchor="middle" fontWeight="bold" className="font-mono">
                       {Math.round(airflowUnitHook.getDisplayValue(airflow))} {flowUnit}
                     </text>
                     
                     {/* Right side (Splitting vs Single) */}
                     {enableSplitting ? (
                       <g>
                         {/* Manifold */}
                         <rect x="175" y="40" width="20" height="80" fill="#334155" rx="4" />
                         
                         {branches.slice(0, 4).map((b, i, arr) => {
                           const num = arr.length;
                           const spacing = 80 / (num + 1);
                           const yPos = 40 + spacing * (i + 1);
                           const branchVal = airflowUnitHook.getDisplayValue(b.cfm);
                           
                           return (
                             <g key={i}>
                               <path d={`M 195 ${yPos} L 270 ${yPos}`} fill="none" stroke={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} strokeWidth="6" opacity="0.7" />
                               {ductType === 'supply' ? (
                                 <polygon points={`260,${yPos - 5} 270,${yPos} 260,${yPos + 5}`} fill={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} />
                               ) : (
                                 <polygon points={`205,${yPos - 5} 195,${yPos} 205,${yPos + 5}`} fill={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} />
                               )}
                               <rect x="270" y={yPos - 12} width="65" height="24" fill="#1e293b" stroke="#475569" strokeWidth="1" rx="2" />
                               <text x="302.5" y={yPos + 3} fill="#94a3b8" fontSize="8" textAnchor="middle">Branch {i+1}</text>
                               <text x="235" y={yPos - 6} fill={ductType === 'supply' ? '#38bdf8' : ductType === 'return' ? '#c084fc' : '#fbbf24'} fontSize="8" textAnchor="middle" className="font-mono">{Math.round(branchVal)}</text>
                             </g>
                           )
                         })}
                         {branches.length > 4 && (
                            <text x="302.5" y="140" fill="#64748b" fontSize="10" textAnchor="middle" fontStyle="italic">+ {branches.length - 4} more...</text>
                         )}
                       </g>
                     ) : (
                       <g>
                         <path d="M 175 80 L 290 80" fill="none" stroke={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} strokeWidth="16" opacity="0.7" />
                         {ductType === 'supply' ? (
                           <polygon points="275,68 295,80 275,92" fill={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} />
                         ) : (
                           <polygon points="190,68 170,80 190,92" fill={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} />
                         )}
                         <rect x="295" y="50" width="80" height="60" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="6" />
                         <text x="335" y="84" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                           {ductType === 'supply' ? 'Zone / Diffuser' : ductType === 'return' ? 'Return Grille' : 'Hood / Intake'}
                         </text>
                       </g>
                     )}
                     
                     {/* Type Badge */}
                     <rect x="290" y="10" width="90" height="20" fill="#0f172a" stroke={ductType === 'supply' ? '#0ea5e9' : ductType === 'return' ? '#9333ea' : '#d97706'} strokeWidth="1" rx="4" />
                     <text x="335" y="24" fill={ductType === 'supply' ? '#38bdf8' : ductType === 'return' ? '#c084fc' : '#fbbf24'} fontSize="9" textAnchor="middle" fontWeight="bold" letterSpacing="1">
                       {ductType === 'supply' ? 'SUPPLY AIR' : ductType === 'return' ? 'RETURN AIR' : 'EXHAUST AIR'}
                     </text>
                   </svg>
                 </div>
              </div>
              
              {/* Duct visual cross-section representation using dynamic SVG shape */}"""

if search in content:
    content = content.replace(search, schematic)
    with open('src/components/DuctSizingCalc.tsx', 'w') as f:
        f.write(content)
        print("Patched successfully")
else:
    print("Search string not found")

