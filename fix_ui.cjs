const fs = require('fs');

const file = 'src/components/common/EngineeringStatusHeader.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "export type EngineeringStatus = 'READY' | 'CALCULATED' | 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE' | 'NOT_APPLICABLE';",
  "export type EngineeringStatus = 'READY' | 'CALCULATED' | 'PASS' | 'WARNING' | 'FAIL' | 'NOT_VERIFIED' | 'INCOMPLETE' | 'NOT_APPLICABLE';"
);

const newCase = `
    case 'NOT_VERIFIED':
      bgColor = 'bg-fuchsia-950/20';
      borderColor = 'border-fuchsia-500/50';
      textColor = 'text-fuchsia-400';
      Icon = AlertTriangle;
      break;
    case 'FAIL':`;

content = content.replace("    case 'FAIL':", newCase);

fs.writeFileSync(file, content);

