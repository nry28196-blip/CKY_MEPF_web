const history = [
  { tab: 'mechanical', subType: 'cooling', summary: '120 m² | 4 Occ. | 3.5 TR' },
  { tab: 'mechanical', subType: 'cooling', summary: '2 Zones | 10.2 TR | Rec: 12 HP' },
  { tab: 'mechanical', subType: 'ductSizing', parameters: { airflow: 1500 } },
  { tab: 'fire', summary: 'Sprinklers: 150 | Flows: 1200 Lpm | Heads: 12' },
  { tab: 'fire', summary: 'Pump: 20 HP | Head: 50m | Flow: 1500 Lpm' }
];

let totalCooling = 0;
let totalAirflow = 0;
let totalFireWater = 0;

history.forEach(item => {
  if (item.tab === 'mechanical' && item.subType === 'cooling') {
    const match = item.summary.match(/([\d\.]+)\s*TR/);
    if (match) totalCooling += parseFloat(match[1]);
  }
  if (item.tab === 'mechanical' && item.subType === 'ductSizing') {
    if (item.parameters && item.parameters.airflow) {
      totalAirflow += parseFloat(item.parameters.airflow);
    }
  }
  if (item.tab === 'fire') {
    const match = item.summary.match(/Flows?:\s*([\d\.]+)\s*Lpm/i);
    if (match) totalFireWater += parseFloat(match[1]);
  }
});

console.log({ totalCooling, totalAirflow, totalFireWater });
