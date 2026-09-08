const fs = require('fs');
let content = fs.readFileSync('src/data/ventilation/ashrae621/2025/data.ts', 'utf8');

content = content.replace(/revisionSource: 'Base'/g, "revisionSource: '2025 Base + Errata', verificationDate: '2026-09-07'");
content = content.replace(/revision: 'Base'/g, "revision: '2025 Base + Errata', verificationDate: '2026-09-07'");

fs.writeFileSync('src/data/ventilation/ashrae621/2025/data.ts', content);
