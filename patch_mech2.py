with open('src/components/MechanicalCalc.tsx', 'r') as f:
    lines = f.readlines()

import_idx = -1
for i, line in enumerate(lines):
    if "import VrfTopologyCanvas from './VrfTopologyCanvas';" in line:
        import_idx = i
        break

if import_idx != -1:
    lines[import_idx] = "import VrfTopologyCanvas from './VrfTopologyCanvas';\nimport VrfLoadDistributionChart from './VrfLoadDistributionChart';\n"

# Replace w-full
for i, line in enumerate(lines):
    if "              <div className=\"w-full\">" in line and "Zones / Indoor Units Sizing Table" in lines[i+1]:
        lines[i] = "              <div className=\"w-full\">\n                <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">\n                  <div className=\"lg:col-span-2 space-y-6\">\n"
        break

# Replace end
for i, line in enumerate(lines):
    if "          {/* Interactive Trend Chart Section */}" in line:
        # Go back up a bit to close the tags
        # The structure before is:
        #                 </div>
        #               </div>
        #             </div>
        #           )}
        
        # We want to change the divs before `)}`
        
        # Let's find the `)}` line
        for j in range(i-1, i-10, -1):
            if "          )}" in lines[j]:
                # We need to insert closing tags before `)}`
                # actually, we want to replace `              </div>` before the `</div>` before `)}`
                
                # The lines are:
                # 1625:                 </div>
                # 1626:               </div>
                # 1627:             </div>
                # 1628:           )}
                
                lines[j-2] = "                  </div>\n                  <div className=\"lg:col-span-1\">\n                    <VrfLoadDistributionChart rooms={vrfRooms} />\n                  </div>\n                </div>\n              </div>\n"
                break
        break

with open('src/components/MechanicalCalc.tsx', 'w') as f:
    f.writelines(lines)
print("Done")
