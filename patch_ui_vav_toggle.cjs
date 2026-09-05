const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

const target = `<option value="multi_alternative">Multi-Zone Alternative Procedure (Appendix A)</option>
            </select>
          </div>
        </div>`;

const replacement = `<option value="multi_alternative">Multi-Zone Alternative Procedure (Appendix A)</option>
            </select>
          </div>
          
          {systemType.startsWith('multi') && (
            <div>
              <TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Air Distribution System" tooltip="Select whether the system supplies a constant volume of air or utilizes Variable Air Volume (VAV) terminals." />
              <select 
                value={isVAV ? 'vav' : 'cv'}
                onChange={(e) => setIsVAV(e.target.value === 'vav')}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"
              >
                <option value="vav">Variable Air Volume (VAV)</option>
                <option value="cv">Constant Volume (CV)</option>
              </select>
            </div>
          )}
        </div>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
