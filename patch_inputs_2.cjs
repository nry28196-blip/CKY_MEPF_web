const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// 3. Zone Area
const areaRegex = /<input[^>]*value=\{zr\.input\.area\}[^>]*onChange=\{\(e\) => updateZone\(zr\.input\.id, 'area', Number\(e\.target\.value\)\)\}[^>]*\/>/g;
const areaReplacement = `<ValidatedInput 
                  type="number" min={0.1}
                  errorMsg="Zone Area must be > 0"
                  value={zr.input.area}
                  onChange={(e) => updateZone(zr.input.id, 'area', Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-indigo-500"
                />`;
content = content.replace(areaRegex, areaReplacement);

// 4. Zone Occupants
const occRegex = /<input[^>]*value=\{zr\.input\.occupants\}[^>]*onChange=\{\(e\) => updateZone\(zr\.input\.id, 'occupants', Number\(e\.target\.value\)\)\}[^>]*\/>/g;
const occReplacement = `<ValidatedInput 
                      type="number" min={0}
                      errorMsg="Occupants cannot be negative"
                      value={zr.input.occupants}
                      onChange={(e) => updateZone(zr.input.id, 'occupants', Number(e.target.value))}
                      disabled={zr.input.useDefaultOccupancy}
                      className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />`;
content = content.replace(occRegex, occReplacement);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Patched Area and Occupants");
