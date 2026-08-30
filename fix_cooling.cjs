const fs = require('fs');
let content = fs.readFileSync('src/components/CoolingLoadReference.tsx', 'utf8');

content = content.replace(
  'Cooling Load Estimation Rules of Thumb',
  '{isKhmer ? \'ឯកសារយោងបន្ទុកម៉ាស៊ីនត្រជាក់\' : \'Cooling Load Estimation Rules of Thumb\'}'
);

content = content.replace(
  '<strong className="text-sky-300">Reference Disclaimer:</strong> These parameters are approximate rule-of-thumb ranges based on standard ASHRAE guidelines for temperate to hot climates.',
  '{isKhmer ? <><strong className="text-sky-300">កំណត់សម្គាល់៖</strong> ប៉ារ៉ាម៉ែត្រទាំងនេះគឺជាតម្លៃប្រហាក់ប្រហែលផ្អែកលើស្តង់ដារ ASHRAE សម្រាប់អាកាសធាតុក្តៅ។</> : <><strong className="text-sky-300">Reference Disclaimer:</strong> These parameters are approximate rule-of-thumb ranges based on standard ASHRAE guidelines for temperate to hot climates.</>}'
);

content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800">Space Type</th>',
  '<th className="px-4 py-3 border-b border-slate-800">{isKhmer ? "ប្រភេទបន្ទប់" : "Space Type"}</th>'
);

content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-sky-400">Low (BTU/h/ft²)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-sky-400">{isKhmer ? "ទាប (Low)" : "Low"} (BTU/h/ft²)</th>'
);

content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-emerald-400">High (BTU/h/ft²)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-emerald-400">{isKhmer ? "ខ្ពស់ (High)" : "High"} (BTU/h/ft²)</th>'
);

content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-amber-400">Occupancy (ft²/person)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-amber-400">{isKhmer ? "មនុស្ស (Occupancy)" : "Occupancy"} (ft²/person)</th>'
);

fs.writeFileSync('src/components/CoolingLoadReference.tsx', content, 'utf8');
