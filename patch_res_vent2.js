import fs from 'fs';
let code = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf8');

const startIndex = code.indexOf('<div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl shadow-lg">\n            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">\n              <div className="flex items-center space-x-2">\n                <Wind className="h-5 w-5 text-sky-400" />\n                <h3 className="text-sm font-bold text-slate-200 tracking-wide">Local Exhaust Requirements</h3>');

if (startIndex > -1) {
    const nextDivIndex = code.indexOf('<div className="space-y-6">', startIndex);
    
    // In grid-cols-3, the first col-span-2 has two divs. The second div is the local exhaust block.
    // The next block after col-span-2 is a separate col for the total.
    
    if (nextDivIndex > -1) {
       const endIndex = code.lastIndexOf('</div>', nextDivIndex) - 10;
       // Just to be safe, I will find the exact string that ends the col-span-2 section
       const searchEnd = code.indexOf('</div>\n        <div className="space-y-6">', startIndex);
       
       if (searchEnd > -1) {
           code = code.substring(0, startIndex) + code.substring(searchEnd);
           fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', code);
           console.log("Replaced successfully!");
       } else {
           console.log("Could not find end of col-span-2");
       }
    }
}
