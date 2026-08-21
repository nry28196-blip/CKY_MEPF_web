const fs = require('fs');
const filePath = './src/components/MechanicalCalc.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace pipingLength inputs
const targetOpening = `                      ) : (
                        <input
                          type="number"
                          value={pipingLength}
                          onChange={(e) => setPipingLength(e.target.value === '' ? '' : Number(e.target.value) as any)}
                          placeholder="e.g., 80"`;

const replacementOpening = `                      ) : (
                        <div>
                          <input
                            type="number"
                            value={pipingLength}
                            onChange={(e) => setPipingLength(e.target.value === '' ? '' : Number(e.target.value) as any)}
                            placeholder="e.g., 80"`;

const targetClosing = `                             pipingLength !== '' && (Number(pipingLength) < 5 || Number(pipingLength) > 1000)
                               ? 'border-red-500/70 focus:ring-1 focus:ring-red-500/20 text-red-200'
                               : 'border-slate-800 focus:border-emerald-500'
                           }\`}
                        />
                      )}`;

const replacementClosing = `                             pipingLength !== '' && (Number(pipingLength) < 5 || Number(pipingLength) > 1000)
                               ? 'border-red-500/70 focus:ring-1 focus:ring-red-500/20 text-red-200'
                               : 'border-slate-800 focus:border-emerald-500'
                           }\`}
                          />
                          {pipingLength !== '' && (Number(pipingLength) < 5 || Number(pipingLength) > 1000) && (
                            <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe engineering range: 5 to 1,000 meters</p>
                          )}
                        </div>
                      )}`;

if (content.includes(targetOpening)) {
  content = content.replace(targetOpening, replacementOpening);
  if (content.includes(targetClosing)) {
    content = content.replace(targetClosing, replacementClosing);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated MechanicalCalc.tsx pipingLength!');
  } else {
    console.log('Failed to match target closing');
  }
} else {
  console.log('Failed to match target opening');
}
