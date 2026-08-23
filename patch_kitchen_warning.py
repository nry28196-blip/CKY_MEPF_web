import re

with open('src/components/KitchenVentilationCalc.tsx', 'r') as f:
    content = f.read()

# 1. Add warning checks to render logic
warning_logic = """
  const isOverhangWarning = overhang < (isMetric ? 0.15 : 0.5);
  const isVelocityWarning = ductVelocity < (isMetric ? 2.54 : 500);
"""

# Insert right before return
content = content.replace("  return (", warning_logic + "\n  return (")

# 2. Add Warning UI
warning_ui = """
             {(isOverhangWarning || isVelocityWarning) && (
               <div className="bg-amber-950/40 border border-amber-900/50 p-4 rounded-lg flex items-start space-x-3 mt-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-500 uppercase">NFPA 96 Compliance Warning</h4>
                    <ul className="text-[11px] text-amber-200/70 mt-2 space-y-1 list-disc list-inside">
                      {isOverhangWarning && (
                        <li>Hood overhang should be at least {isMetric ? '0.15 m' : '6 inches (0.5 ft)'} on all open sides.</li>
                      )}
                      {isVelocityWarning && (
                        <li>Exhaust duct velocity must be at least {isMetric ? '2.54 m/s' : '500 FPM'} to ensure grease entrainment.</li>
                      )}
                    </ul>
                  </div>
               </div>
             )}
"""

# Insert after Make-Up Air Requirement
content = content.replace("</div>\n             </div>\n             \n             <div", "</div>\n             </div>\n" + warning_ui + "             \n             <div")

with open('src/components/KitchenVentilationCalc.tsx', 'w') as f:
    f.write(content)
