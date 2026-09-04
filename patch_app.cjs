const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');

if (!app.includes("CostCalc")) {
  app = app.replace(
    "import BulkCalc from './components/BulkCalc';",
    "import BulkCalc from './components/BulkCalc';\nimport CostCalc from './components/CostCalc';"
  );
}

app = app.replace(
  `case 'bulk': \n        return (\n          <BulkCalc history={history} />\n        );`,
  `case 'bulk': \n        return (\n          <BulkCalc history={history} />\n        );\n      case 'cost':\n        return (\n          <CostCalc history={history} />\n        );`
);

app = app.replace(
  `{ id: 'bulk', icon: <Layers className="w-4 h-4" />, label: 'Bulk Batch' },`,
  `{ id: 'bulk', icon: <Layers className="w-4 h-4" />, label: 'Bulk Batch' },\n    { id: 'cost', icon: <DollarSign className="w-4 h-4" />, label: 'Cost Est.' },`
);

if (!app.includes("DollarSign")) {
  app = app.replace(
    "CheckSquare, Square, Languages, PanelRightOpen, PanelRightClose, Layers, Download, Ruler",
    "CheckSquare, Square, Languages, PanelRightOpen, PanelRightClose, Layers, Download, Ruler, DollarSign"
  );
}

fs.writeFileSync('src/App.tsx', app);

let types = fs.readFileSync('src/types.ts', 'utf-8');
if (!types.includes("'cost'")) {
  types = types.replace(
    `export type TabType = 'mechanical' | 'electrical' | 'plumbing' | 'fire' | 'bulk';`,
    `export type TabType = 'mechanical' | 'electrical' | 'plumbing' | 'fire' | 'bulk' | 'cost';`
  );
  fs.writeFileSync('src/types.ts', types);
}

