const fs = require('fs');
let content = fs.readFileSync('src/components/VentilationReferenceModal.tsx', 'utf8');

content = content.replace(
  'Standard outdoor air requirements according to ASHRAE 62.1-2019 Table 6.2.2.1. \\n                Values shown are the people outdoor air rate (Rp) and the area outdoor air rate (Ra).',
  `{isKhmer ? 'តម្រូវការខ្យល់ខាងក្រៅស្តង់ដារតាម ASHRAE 62.1-2019 Table 6.2.2.1។ តម្លៃដែលបង្ហាញគឺអត្រាខ្យល់សម្រាប់មនុស្ស (Rp) និងសម្រាប់ផ្ទៃក្រឡា (Ra)។' : 'Standard outdoor air requirements according to ASHRAE 62.1-2019 Table 6.2.2.1. Values shown are the people outdoor air rate (Rp) and the area outdoor air rate (Ra).'}`
);

content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800">Occupancy Category</th>',
  '<th className="px-4 py-3 border-b border-slate-800">{isKhmer ? "ប្រភេទបន្ទប់ (Occupancy)" : "Occupancy Category"}</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-sky-400">Rp (CFM/person)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-sky-400">Rp {isKhmer ? "(CFM/មនុស្ស)" : "(CFM/person)"}</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-emerald-400">Ra (CFM/ft²)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-emerald-400">Ra (CFM/ft²)</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center">Default Density (#/1000 ft²)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center">{isKhmer ? "ដង់ស៊ីតេ (Density)" : "Default Density"} (#/1000 ft²)</th>'
);

fs.writeFileSync('src/components/VentilationReferenceModal.tsx', content, 'utf8');
