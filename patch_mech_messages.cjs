const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

const target = `<div className="flex bg-slate-950 border border-slate-850 p-0.5 rounded-lg text-[9px] font-bold uppercase w-fit z-10 relative">`;
const replacement = `{validationResult && validationResult.status === 'FAIL' && (
                    <div className="absolute right-0 top-10 mt-2 z-50 bg-rose-950/90 backdrop-blur border border-rose-800 p-3 rounded-lg shadow-xl shadow-rose-900/20 max-w-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="text-[10px] font-bold text-rose-400 mb-1 uppercase tracking-wider">Validation Issues</div>
                      <ul className="text-xs text-rose-200 list-disc pl-4 space-y-1">
                        {validationResult.messages.map((msg, idx) => (
                          <li key={idx}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex bg-slate-950 border border-slate-850 p-0.5 rounded-lg text-[9px] font-bold uppercase w-fit z-10 relative">`;

// But there is no group class on the container to trigger group-hover:opacity-100
// So I will just render it inside the card if there are errors.

const targetAlternative = `</div>
                
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">`;

const replacementAlternative = `</div>
                
                {validationResult && validationResult.status === 'FAIL' && (
                  <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-3 mb-2">
                    <div className="flex items-center space-x-2 text-rose-400 mb-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Engineering Flags</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1">
                      {validationResult.messages.map((msg, idx) => (
                        <li key={idx} className="text-xs text-rose-300/80 leading-relaxed">{msg}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">`;

if (code.includes(targetAlternative)) {
  code = code.replace(targetAlternative, replacementAlternative);
  fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
  console.log("Patched validation messages.");
} else {
  console.log("Target not found.");
}
