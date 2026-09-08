const fs = require('fs');

const file = 'src/components/AuditTrailTable.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "case 'FAIL':",
  "case 'NOT_VERIFIED':\n        return <AlertTriangle className=\"w-3 h-3 text-fuchsia-400\" />;\n      case 'FAIL':"
);

content = content.replace(
  "return 'text-emerald-400';\n      case 'FAIL':",
  "return 'text-emerald-400';\n      case 'NOT_VERIFIED':\n        return 'text-fuchsia-400';\n      case 'FAIL':"
);

fs.writeFileSync(file, content);

