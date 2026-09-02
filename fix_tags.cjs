const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

const badContent = `                        <div className="text-right font-bold text-amber-400 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800">{Math.round(results.calculatedTotal)} W</div>
                      </div>
                    </div>
                      </div>
                    </div>`;

const goodContent = `                        <div className="text-right font-bold text-amber-400 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800">{Math.round(results.calculatedTotal)} W</div>
                      </div>
                    </div>`;

if (code.includes(badContent)) {
  code = code.replace(badContent, goodContent);
  fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
  console.log("Fixed duplicated tags.");
} else {
  console.log("Bad content not found. Let's try regex.");
  // fall back to regex if spacing mismatch
  code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{ventilationDetails && \(/, '</div>\n                    </div>\n                    {ventilationDetails && (');
  fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
}
