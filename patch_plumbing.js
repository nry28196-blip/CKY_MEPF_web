import fs from 'fs';
let code = fs.readFileSync('src/components/PlumbingCalc.tsx', 'utf8');

code = code.replace(
  `  const [appliedFittings, setAppliedFittings] = useState<SelectedFitting[]>([\n    { id: 'init-1', typeId: 'elbow_90', qty: 6 },\n    { id: 'init-2', typeId: 'tee_branch', qty: 4 },\n  ]);`,
  `  const [appliedFittings, setAppliedFittings] = useState<SelectedFitting[]>([]);`
);

fs.writeFileSync('src/components/PlumbingCalc.tsx', code);
