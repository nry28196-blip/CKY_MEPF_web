import fs from 'fs';

let code = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

if (!code.includes('VentilationReferenceModal')) {
  code = code.replace(
    "import { useLanguage } from '../lib/translations';",
    "import { useLanguage } from '../lib/translations';\nimport VentilationReferenceModal from './VentilationReferenceModal';"
  );
}
if (!code.includes('BookOpen')) {
  code = code.replace(
    "import { Wind, Users, Square, Info, FileSpreadsheet, CheckCircle2, ChevronRight, Activity, AlertTriangle, ArrowDown, Thermometer, Bookmark, Layers, Settings } from 'lucide-react';",
    "import { Wind, Users, Square, Info, FileSpreadsheet, CheckCircle2, ChevronRight, Activity, AlertTriangle, ArrowDown, Thermometer, Bookmark, Layers, Settings, BookOpen } from 'lucide-react';"
  );
}

fs.writeFileSync('src/components/VentilationCalc.tsx', code);
