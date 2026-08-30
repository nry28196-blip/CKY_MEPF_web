const fs = require('fs');
let content = fs.readFileSync('src/components/IPCReferenceModal.tsx', 'utf8');

content = content.replace(
  'Standard fixture unit values according to the International Plumbing Code (IPC) and British Standards (BS EN 806 / BS EN 12056). \\n            Water Supply Fixture Units (WSFU/LU) estimate peak water demand, while Drainage Fixture Units (DFU/DU) are used for sizing sanitary drainage and vent systems.',
  `{isKhmer 
              ? 'តម្លៃឯកតាបន្ទុកឧបករណ៍ស្តង់ដារយោងតាម International Plumbing Code (IPC) និង British Standards (BS EN 806 / BS EN 12056)។ Water Supply Fixture Units (WSFU/LU) ប៉ាន់ស្មានតម្រូវការទឹកអតិបរមា ខណៈ Drainage Fixture Units (DFU/DU) ត្រូវបានប្រើសម្រាប់គណនាទំហំបំពង់បង្ហូរទឹកស្អុយ។'
              : 'Standard fixture unit values according to the International Plumbing Code (IPC) and British Standards (BS EN 806 / BS EN 12056). Water Supply Fixture Units (WSFU/LU) estimate peak water demand, while Drainage Fixture Units (DFU/DU) are used for sizing sanitary drainage and vent systems.'}`
);

content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800">Fixture Type</th>',
  '<th className="px-4 py-3 border-b border-slate-800">{isKhmer ? "ប្រភេទឧបករណ៍" : "Fixture Type"}</th>'
);

fs.writeFileSync('src/components/IPCReferenceModal.tsx', content, 'utf8');
