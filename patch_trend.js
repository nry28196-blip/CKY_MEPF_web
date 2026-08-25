import fs from 'fs';
let code = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

code = code.replace(
  `                <XAxis 
                  dataKey={type === 'fire_sizing' ? 'durationMins' : 'occupantsCount'} 
                  stroke={labelColor} 
                  tickLine={false}
                />`,
  `                <XAxis 
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  dataKey={type === 'fire_sizing' ? 'durationMins' : 'occupantsCount'} 
                  stroke={labelColor} 
                  tickLine={false}
                />`
);

code = code.replace(
  `                <XAxis 
                  dataKey={
                    type === 'electrical' ? 'powerKw' :
                    type === 'cooling' ? (currentParams.estimationBasis === 'volume' ? 'roomVolumeM3' : 'areaM2') :
                    type === 'ductSizing' ? 'cfm' :
                    type === 'plumbing_fixtures' ? 'loadingUnits' :
                    'buildingHeightM'
                  } 
                  stroke={labelColor}
                  tickLine={false}
                />`,
  `                <XAxis 
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  dataKey={
                    type === 'electrical' ? 'powerKw' :
                    type === 'cooling' ? (currentParams.estimationBasis === 'volume' ? 'roomVolumeM3' : 'areaM2') :
                    type === 'ductSizing' ? 'cfm' :
                    type === 'plumbing_fixtures' ? 'loadingUnits' :
                    'buildingHeightM'
                  } 
                  stroke={labelColor}
                  tickLine={false}
                />`
);

fs.writeFileSync('src/components/TrendVisualizer.tsx', code);
