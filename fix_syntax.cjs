const fs = require('fs');

let ashrae = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

ashrae = ashrae.replace(
  `                      disabled={zr.input.useDefaultOccupancy}
                    />
                    {zr.input.useDefaultOccupancy && (
                      <div className="text-[10px] text-amber-500 mt-1 leading-tight">
                        ASHRAE default occupancy density used.
                      </div>
                    )}
                      className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />`,
  `                      disabled={zr.input.useDefaultOccupancy}
                      className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {zr.input.useDefaultOccupancy && (
                      <div className="text-[10px] text-amber-500 mt-1 leading-tight">
                        ASHRAE default occupancy density used.
                      </div>
                    )}`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', ashrae);

