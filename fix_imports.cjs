const fs = require('fs');

let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

if (!content.includes('ValidatedInput')) {
  content = content.replace(
    "import { Settings, Info, Plus, Trash2, Activity, Wind } from 'lucide-react';",
    "import { Settings, Info, Plus, Trash2, Activity, Wind } from 'lucide-react';\nimport ValidatedInput from './ValidatedInput';"
  );
  fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
  console.log('Added ValidatedInput import');
} else {
  console.log('ValidatedInput already imported');
}
