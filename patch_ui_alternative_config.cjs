const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

// Add state
code = code.replace(
  /const \[isVAV, setIsVAV\] = useState<boolean>\(true\);/,
  `const [isVAV, setIsVAV] = useState<boolean>(true);
  const [alternativeConfig, setAlternativeConfig] = useState<'single-supply' | 'secondary-recirculation'>('single-supply');`
);

// Add to calculateSystem call
code = code.replace(
  /zones: zoneResults,\n\s*isVAV\n\s*\}, systemPopulation === '' \? null : systemPopulation, systemPrimaryAirflow === '' \? null : systemPrimaryAirflow, currentErho, method\);/,
  `zones: zoneResults,
        isVAV,
        alternativeConfig
      }, systemPopulation === '' ? null : systemPopulation, systemPrimaryAirflow === '' ? null : systemPrimaryAirflow, currentErho, method);`
);

// Add to validation state
code = code.replace(
  /const state = \{\n\s*systemType,\n\s*isVAV,/,
  `const state = {
      systemType,
      isVAV,
      alternativeConfig,`
);

// Add global dropdown for Alternative Config
const toggleTarget = `{systemType.startsWith('multi') && (
            <div>
              <TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Air Distribution System" tooltip="Select whether the system supplies a constant volume of air or utilizes Variable Air Volume (VAV) terminals." />`;

const toggleReplacement = `{systemType === 'multi_alternative' && (
            <div>
              <TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Alternative Procedure Config" tooltip="Select whether the system is single-supply (default) or uses secondary recirculation." />
              <select 
                value={alternativeConfig}
                onChange={(e) => setAlternativeConfig(e.target.value as any)}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"
              >
                <option value="single-supply">Single-Supply System</option>
                <option value="secondary-recirculation">Secondary Recirculation System</option>
              </select>
            </div>
          )}
          
          {systemType.startsWith('multi') && (
            <div>
              <TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Air Distribution System" tooltip="Select whether the system supplies a constant volume of air or utilizes Variable Air Volume (VAV) terminals." />`;

code = code.replace(toggleTarget, toggleReplacement);


// Add inputs for Ep and Er to Zone UI if alternativeConfig === 'secondary-recirculation'
const zoneTarget = `onChange={(e) => updateZone(zr.input.id, 'vpzMin', e.target.value === '' ? '' : Number(e.target.value))}
                      disabled={!isVAV}
                      className="w-full bg-amber-950/10 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              )}`;

const zoneReplacement = `onChange={(e) => updateZone(zr.input.id, 'vpzMin', e.target.value === '' ? '' : Number(e.target.value))}
                      disabled={!isVAV}
                      className="w-full bg-amber-950/10 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  {systemType === 'multi_alternative' && alternativeConfig === 'secondary-recirculation' && (
                    <>
                      <div>
                        <TooltipLabel className="block text-xs font-bold text-sky-400 mb-1.5 uppercase" label="Ep" tooltip="Primary air fraction to the zone" />
                        <ValidatedInput 
                          type="number" min={0} max={1} step={0.1}
                          errorMsg="Ep must be between 0 and 1"
                          value={zr.input.ep}
                          onChange={(e) => updateZone(zr.input.id, 'ep', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <TooltipLabel className="block text-xs font-bold text-sky-400 mb-1.5 uppercase" label="Er" tooltip="Secondary recirculation fraction" />
                        <ValidatedInput 
                          type="number" min={0} max={1} step={0.1}
                          errorMsg="Er must be between 0 and 1"
                          value={zr.input.er}
                          onChange={(e) => updateZone(zr.input.id, 'er', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}`;

code = code.replace(zoneTarget, zoneReplacement);


fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
