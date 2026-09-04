const fs = require('fs');
let content = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf8');

// I will insert states for qInf and phi
content = content.replace(
  `const [kitchenMode`,
  `const [qInf, setQInf] = useState<number>(0);\n  const [phi, setPhi] = useState<number>(1.0);\n  const [qFan, setQFan] = useState<number>(0);\n  const [kitchenMode`
);

// I will replace the useEffect for totalAirflow
content = content.replace(
  /useEffect\(\(\) => \{[\s\S]*?\}, \[floorArea, bedrooms, isMetric\]\);/,
  `useEffect(() => {
    import('../calculations/ventilation/Ashrae622Service').then(({ Ashrae622Service }) => {
       const res = Ashrae622Service.calculateVentilation({
          floorArea,
          bedrooms,
          isMetric,
          qInf,
          phi
       });
       setTotalAirflow(res.qTot);
       setQFan(res.qFan);
    });
  }, [floorArea, bedrooms, isMetric, qInf, phi]);`
);

// I will add inputs for Qinf and Phi
const newInputs = `
            <div>
              <TooltipLabel label="Infiltration (Qinf)" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
              <input type="number" min="0" value={qInf} onChange={(e) => setQInf(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-purple-500 text-sm" />
            </div>
            <div>
              <TooltipLabel label="Infiltration Credit Factor (Φ)" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
              <input type="number" min="0" max="1" step="0.1" value={phi} onChange={(e) => setPhi(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-purple-500 text-sm" />
            </div>
`;

content = content.replace(
  `<div>\n              <TooltipLabel label="Bedrooms"`,
  `${newInputs}\n            <div>\n              <TooltipLabel label="Bedrooms"`
);

// I will add output for Qfan
content = content.replace(
  `<p className="text-[10px] text-slate-500 mt-2 z-10 text-center">Eq. 4.1.1</p>`,
  `<p className="text-[10px] text-slate-500 mt-2 z-10 text-center">Qtot (Eq. 4.1.1)</p>\n              <div className="mt-4 pt-4 border-t border-purple-900/30 w-full text-center z-10">\n                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Fan Airflow (Qfan)</p>\n                <p className="text-3xl font-black text-white font-mono tracking-tight drop-shadow-md">\n                  {Math.ceil(qFan).toLocaleString()}\n                  <span className="text-sm font-bold text-purple-400 uppercase tracking-widest ml-1">{flowUnit}</span>\n                </p>\n                <p className="text-[10px] text-slate-500 mt-2">Qfan = Qtot - Φ * Qinf</p>\n              </div>`
);

fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', content);
