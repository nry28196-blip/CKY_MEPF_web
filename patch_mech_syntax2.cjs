const fs = require('fs');
const file = 'src/components/MechanicalCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/<div className="text-right">\{useAltitudeAdj \? \(AirDensityService\.getAirProperties\(isMetric \? altitude : UnitConversionService\.ftToM\(altitude\), outdoorTemp, relativeHumidity\)\.densityRatio \|\| 0\)\.toFixed\(3\) : '1\.000'\}<\/div>/, '<div className="text-right">{useAltitudeAdj ? (AirDensityService.getAirProperties(isMetric ? altitude : UnitConversionService.ftToM(altitude), outdoorTemp, relativeHumidity).densityRatio || 0).toFixed(3) : \'1.000\'}</div>');

code = code.replace(/<div className="text-right">\{\(\(useAltitudeAdj \? \(AirDensityService\.getAirProperties\(isMetric \? altitude : UnitConversionService\.ftToM\(altitude\), outdoorTemp, relativeHumidity\)\.densityRatio : 1\.0\) \* 1\.21\)\.toFixed\(3\)\} kJ\/kg·K<\/div>/, '<div className="text-right">{((useAltitudeAdj ? AirDensityService.getAirProperties(isMetric ? altitude : UnitConversionService.ftToM(altitude), outdoorTemp, relativeHumidity).densityRatio : 1.0) * 1.21).toFixed(3)} kJ/kg·K</div>');

code = code.replace(/<div className="text-right">\{\(\(useAltitudeAdj \? \(AirDensityService\.getAirProperties\(isMetric \? altitude : UnitConversionService\.ftToM\(altitude\), outdoorTemp, relativeHumidity\)\.densityRatio : 1\.0\) \* 3010\)\.toFixed\(0\)\} kJ\/kg<\/div>/, '<div className="text-right">{((useAltitudeAdj ? AirDensityService.getAirProperties(isMetric ? altitude : UnitConversionService.ftToM(altitude), outdoorTemp, relativeHumidity).densityRatio : 1.0) * 3010).toFixed(0)} kJ/kg</div>');

fs.writeFileSync(file, code);
