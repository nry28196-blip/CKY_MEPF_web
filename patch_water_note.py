import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

search_str = """                  <div className="pt-2">
                    <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                      Suggested Cold Water Pipe
                    </span>
                    <p className="text-sm font-extrabold text-white mt-1">
                      {recommendedWaterPipe}{' '}
                      <span className="text-[10px] text-slate-500 font-mono font-normal">({calculatedWaterPipeDia.toFixed(1)} mm calculated)</span>
                    </p>
                  </div>"""

replacement_str = """                  <div className="pt-2">
                    <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                      {standard === 'bs' ? 'Suggested Cold Water Pipe' : 'Preliminary Cold Water Pipe (Velocity-Based)'}
                    </span>
                    <p className="text-sm font-extrabold text-white mt-1">
                      {recommendedWaterPipe}{' '}
                      <span className="text-[10px] text-slate-500 font-mono font-normal">({calculatedWaterPipeDia.toFixed(1)} mm calc)</span>
                    </p>
                    {standard === 'ipc' && <span className="block text-[9px] text-slate-500 leading-normal mt-0.5">* IPC requires full friction loss tables for complete sizing.</span>}
                  </div>"""

if search_str in content:
    content = content.replace(search_str, replacement_str)
    print("Patched Water note successfully")
else:
    print("Water note string not found")

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)

