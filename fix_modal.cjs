const fs = require('fs');
let content = fs.readFileSync('src/components/FireCalc.tsx', 'utf8');
content = content.replace(
  '{/* Toast Alert */}',
  '<FireReferenceModal isOpen={isRefModalOpen} onClose={() => setIsRefModalOpen(false)} />\n      {/* Toast Alert */}'
);
fs.writeFileSync('src/components/FireCalc.tsx', content);
