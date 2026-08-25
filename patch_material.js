import fs from 'fs';
let code = fs.readFileSync('src/components/MaterialOptimizerModal.tsx', 'utf8');

code = code.replace(
  `        return {
          size: dia,
          frictionLossBar: (frictionLossM / 10.197).toFixed(2),
          residualBar: residualBar.toFixed(2),
          failed: false
        };`,
  `        return {
          size: dia,
          frictionLossBar: (frictionLossM / 10.197).toFixed(2),
          elevationLossBar: (appliedElevationChange / 10.197).toFixed(2),
          residualBar: residualBar.toFixed(2),
          failed: false
        };`
);

code = code.replace(
  `    return {
      size: maxDia,
      frictionLossBar: (Hf * totalLength / 10.197).toFixed(2),
      residualBar: (appliedAvailablePressure - totalHeadLossBar).toFixed(2),
      failed: true
    };`,
  `    return {
      size: maxDia,
      frictionLossBar: (Hf * totalLength / 10.197).toFixed(2),
      elevationLossBar: (appliedElevationChange / 10.197).toFixed(2),
      residualBar: (appliedAvailablePressure - totalHeadLossBar).toFixed(2),
      failed: true
    };`
);

code = code.replace(
  `                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Friction Loss</span>
                        <span className="text-xs text-orange-400 font-mono">-{mat.result.frictionLossBar} bar</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Residual</span>
                        <span className={\`text-xs font-mono font-bold \${mat.result.failed || Number(mat.result.residualBar) < appliedRequiredResidual ? 'text-red-400' : 'text-emerald-400'}\`}>
                          {mat.result.residualBar} bar`,
  `                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Friction Loss</span>
                        <span className="text-xs text-orange-400 font-mono">-{mat.result.frictionLossBar} bar</span>
                      </div>
                      {mat.result.elevationLossBar && Number(mat.result.elevationLossBar) !== 0 && (
                        <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Elevation {Number(mat.result.elevationLossBar) < 0 ? 'Gain' : 'Loss'}</span>
                          <span className={\`text-xs font-mono \${Number(mat.result.elevationLossBar) < 0 ? 'text-cyan-400' : 'text-orange-400'}\`}>
                            {Number(mat.result.elevationLossBar) < 0 ? '+' : '-'}{Math.abs(Number(mat.result.elevationLossBar)).toFixed(2)} bar
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Residual</span>
                        <span className={\`text-xs font-mono font-bold \${mat.result.failed || Number(mat.result.residualBar) < appliedRequiredResidual ? 'text-red-400' : 'text-emerald-400'}\`}>
                          {mat.result.residualBar} bar`
);

fs.writeFileSync('src/components/MaterialOptimizerModal.tsx', code);
