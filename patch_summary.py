import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

search_str = """                  summaryText = `- Standard: ${standard.toUpperCase()}\\n` +
                    `- Total Load: ${standard === 'bs' ? totalLU + ' LU | ' + totalDU + ' DU' : totalWSFU + ' WSFU | ' + totalDFU + ' DFU'}\\n` +
                    `- Design Velocity: ${designVelocity} m/s\\n` +
                    `- Sewage Slope: ${slope}%\\n` +
                    `- Peak Flow: ${peakFlowLps.toFixed(2)} L/s (${peakFlowGPM.toFixed(1)} GPM)\\n` +
                    `- Recommended Water Pipe: ${recommendedWaterPipe}\\n` +
                    `- Recommended Sewage Pipe: ${sewagePipe.size} (${sewagePipe.reason})`;"""

replacement_str = """                  summaryText = `- Standard: ${standard.toUpperCase()}\\n` +
                    `- Total Load: ${standard === 'bs' ? totalLU + ' LU | ' + totalDU + ' DU' : totalWSFU + ' WSFU | ' + totalDFU + ' DFU'}\\n` +
                    `- Design Velocity: ${designVelocity} m/s\\n` +
                    `- Sewage Slope: ${slope}%\\n` +
                    `- Peak Flow: ${peakFlowLps.toFixed(2)} L/s (${peakFlowGPM.toFixed(1)} GPM)\\n` +
                    (standard === 'bs' 
                      ? `- Recommended Water Pipe: ${recommendedWaterPipe}\\n` 
                      : `- Preliminary Water Pipe (Velocity): ${recommendedWaterPipe} *Requires IPC friction tables for complete sizing.\\n`) +
                    `- Recommended Sewage Pipe: ${sewagePipe.size} (${sewagePipe.reason})`;"""

if search_str in content:
    content = content.replace(search_str, replacement_str)
    print("Patched summary successfully")
else:
    print("Summary string not found")

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)

