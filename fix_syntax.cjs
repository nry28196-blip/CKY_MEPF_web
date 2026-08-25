const fs = require('fs');
let code = fs.readFileSync('src/components/PlumbingCalc.tsx', 'utf8');

const badChunk = `                    )} GPM (No safety factors)
                      </span>
                    )}`;

code = code.replace(badChunk, "");

fs.writeFileSync('src/components/PlumbingCalc.tsx', code);
console.log("Fixed");
