with open('src/components/DuctSizingCalc.tsx', 'r') as f:
    content = f.read()

import_search = "Wind, Copy, FileSpreadsheet, AlertTriangle, CheckCircle2, Sliders, Settings, Layers, HelpCircle, Bookmark, Mail"
import_replace = "Wind, Copy, FileSpreadsheet, AlertTriangle, CheckCircle2, Sliders, Settings, Layers, HelpCircle, Bookmark, Mail, Info"
content = content.replace(import_search, import_replace)

with open('src/components/DuctSizingCalc.tsx', 'w') as f:
    f.write(content)
