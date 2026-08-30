const fs = require('fs');
let content = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');

// I will just use string splitting.
const part1 = content.substring(0, content.indexOf('  return ('));

const p1 = '<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">\n          <h3 className="text-sm font-semibold text-white mb-5 flex items-center">\n            <ChefHat';
const p1Start = content.indexOf(p1);

const p2 = '<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">\n          <h3 className="text-sm font-semibold text-white mb-5 flex items-center">\n             <Wind';
const p2Start = content.indexOf(p2);

const p3 = '<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-full">\n          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">\n            <h3 className="text-sm font-semibold text-white flex items-center">\n              <Activity';
const p3Start = content.indexOf(p3);

// The end of p3 block is basically the end of the file.
// Let's extract them by slicing.
let arr = [
  { start: p1Start, name: 'hood' },
  { start: p2Start, name: 'mua' },
  { start: p3Start, name: 'results' },
].sort((a, b) => a.start - b.start);

const blocks = {};
for (let i = 0; i < arr.length; i++) {
  const current = arr[i];
  const next = arr[i + 1];
  let blockStr = '';
  if (next) {
    blockStr = content.substring(current.start, next.start).trim();
  } else {
    // until the end of the divs.
    const lastClosing = content.lastIndexOf('    </div>\n  );\n}');
    blockStr = content.substring(current.start, lastClosing).trim();
  }
  blocks[current.name] = blockStr;
}

const finalCode = part1 + `  return (
    <div className="space-y-6 animate-fade-in">
      ${blocks.hood}
      
      ${blocks.mua}
      
      ${blocks.results}
    </div>
  );
}`;

fs.writeFileSync('src/components/KitchenVentilationCalc.tsx', finalCode);
console.log('Restructured cleanly');
