const fs = require('fs');
const content = fs.readFileSync('src/components/FireCalc.tsx', 'utf8');

const rightColumnStart = content.indexOf('<div className="space-y-5">\n            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center justify-between">\n              <span>Hydraulic Audit Report</span>');

const rightColumnEnd = content.indexOf('</motion.div>', rightColumnStart);

const snippetToMove = content.substring(rightColumnStart, rightColumnEnd);

// Replace the right column content with the old text format
const oldTextFormat = `<div className="space-y-5">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Hydraulic Audit Report</span>
              <span className="text-[9px] text-slate-500 font-mono">Active Run</span>
            </h3>
            
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                <pre className="text-[10px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {(() => {
                    let summaryText = '';
                    if (subTab === 'equipment') {
                      summaryText = \`- Standard: \${standard.toUpperCase()}\\n\` +
                        \`- Hazard Class: \${hazard.toUpperCase()}\\n\\n\` +
                        \`- Single Sprinkler Flow: \${singleSprinklerFlowLpm.toFixed(1)} Lpm (\${singleSprinklerFlowGPM.toFixed(1)} GPM)\\n\` +
                        \`- Design Area Sprinkler Flow: \${designAreaSprinklerFlowLpm.toFixed(1)} Lpm\\n\` +
                        \`- Hose Stream Allowance: \${standard === 'bs' ? hoseStreamAllowance : (hoseStreamAllowance * 3.7854).toFixed(1)} Lpm\\n\\n\` +
                        \`- COMBINED PEAK SYSTEM DEMAND: \${totalWaterDemandLpm.toFixed(1)} Lpm (\${totalWaterDemandGPM.toFixed(1)} GPM)\`;
                    } else if (subTab === 'sizing') {
                      summaryText = \`- Standard: \${standard.toUpperCase()}\\n\` +
                        \`- Min Flow Duration: \${flowDuration} mins\\n\` +
                        \`- Combined Peak Demand: \${totalWaterDemandLpm.toFixed(1)} Lpm\\n\\n\` +
                        \`- RESERVOIR STORAGE REQ: \${storageTankVolumeM3.toFixed(1)} m³\\n\` +
                        \`  (\${storageTankVolumeLiters.toFixed(1)} Liters)\\n\\n\` +
                        \`- Hydrant Connections Needed: \${hydrantRequiredOutlets}\\n\` +
                        \`- Breeching Inlets: \${minBreechingInletsNeeded} (\${suggestedBreechingType})\`;
                    } else if (subTab === 'pump') {
                      summaryText = \`- Fire Pump Rating: \${totalWaterDemandGPM.toFixed(1)} GPM @ \${totalPumpHeadPsi.toFixed(1)} psi\\n\` +
                        \`- Estimated Motor Power: \${pumpHP.toFixed(1)} HP (\${pumpKW.toFixed(1)} kW)\\n\\n\` +
                        \`- Jockey Pump Rating: \${jockeyFlowGPM.toFixed(1)} GPM @ \${jockeyHeadPsi.toFixed(1)} psi\\n\\n\` +
                        \`- Recommended Pipe Sizes:\\n\` +
                        \`  * Suction: \${firePumpPipes.suction}\\n\` +
                        \`  * Discharge: \${firePumpPipes.discharge}\\n\` +
                        \`  * Riser: \${recommendedRiserPipe}\`;
                    }
                    return summaryText;
                  })()}
                </pre>
            </div>
          </div>
`;

let newContent = content.substring(0, rightColumnStart) + oldTextFormat + content.substring(rightColumnEnd);

// Now I will insert snippetToMove in the left column.
// The equipment subTab ends with:
//               </div>
//             </div>
//           )}
// Let's find:
const equipmentTabEnd = newContent.indexOf('              </div>\n            </div>\n          )}\n\n          {subTab === \'sizing\' && (');

if (equipmentTabEnd > -1) {
  // We want to insert the equipment part of snippetToMove into the equipment subTab!
  const equipStart = snippetToMove.indexOf('{subTab === \'equipment\' && (');
  const equipEnd = snippetToMove.indexOf('{subTab === \'sizing\' && (', equipStart);
  
  if (equipStart > -1 && equipEnd > -1) {
    let equipContent = snippetToMove.substring(equipStart, equipEnd);
    // Remove the {subTab === 'equipment' && (   and   )}   wrapping, because we will place it INSIDE the equipment subtab.
    equipContent = equipContent.replace('{subTab === \'equipment\' && (', '');
    // Remove the last )} which is right before equipEnd
    const lastParen = equipContent.lastIndexOf(')}');
    if (lastParen > -1) {
      equipContent = equipContent.substring(0, lastParen) + equipContent.substring(lastParen + 2);
    }
    
    // Add a title for it:
    equipContent = '\n              <div className="mt-8 pt-6 border-t border-slate-800/80">\n' +
                   '                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">Hydraulic Audit Report</h3>\n' +
                   equipContent +
                   '\n              </div>\n';

    // Insert it before the end of the equipment subtab
    const insertPos = equipmentTabEnd + 21; // index of "</div>\n            </div>\n          )}"
    
    // Actually let's just replace the exact end of the equipment subtab
    newContent = newContent.replace(
      '              </div>\n            </div>\n          )}\n\n          {subTab === \'sizing\' && (',
      equipContent + '              </div>\n            </div>\n          )}\n\n          {subTab === \'sizing\' && ('
    );
  }
}

fs.writeFileSync('src/components/FireCalc.tsx', newContent, 'utf8');
