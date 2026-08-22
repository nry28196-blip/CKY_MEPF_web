import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

# 1. Update calculation block to include typical
old_calc = """  // Calculation
  const rp = isMetric ? spaceType.rpMet : spaceType.rpImp;
  const ra = isMetric ? spaceType.raMet : spaceType.raImp;

  const vbp = occupants * rp; // Breathing zone outdoor airflow (people component)
  const vba = area * ra; // Breathing zone outdoor airflow (area component)
  const vbz = vbp + vba; // Breathing zone total
  const vozBase = vbz / zoneEz; // Zone outdoor airflow"""

new_calc = """  // Calculation
  const rp = isMetric ? spaceType.rpMet : spaceType.rpImp;
  const ra = isMetric ? spaceType.raMet : spaceType.raImp;

  const typicalOccupants = calcDefaultOccupants();
  const typicalVbz = (typicalOccupants * rp) + (area * ra);

  const vbp = occupants * rp; // Breathing zone outdoor airflow (people component)
  const vba = area * ra; // Breathing zone outdoor airflow (area component)
  const vbz = vbp + vba; // Breathing zone total
  const vozBase = vbz / zoneEz; // Zone outdoor airflow

  const deviation = typicalVbz > 0 ? (vbz / typicalVbz) : 1;
  let statusColor = 'text-emerald-400';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let badgeText = 'Typical Range';
  let numberColor = 'text-slate-300';
  let vozNumberColor = 'text-white';
  let vozLabelColor = 'text-emerald-400';
  let borderClass = 'border-slate-800/50';
  let vozBorderClass = 'border-slate-800';
  let vozBgDeco = 'bg-emerald-500/10';

  if (deviation < 0.75) {
    statusColor = 'text-amber-400';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    badgeText = 'Below Typical';
    numberColor = 'text-amber-100';
    vozNumberColor = 'text-amber-50';
    vozLabelColor = 'text-amber-400';
    borderClass = 'border-amber-900/30';
    vozBorderClass = 'border-amber-900/50';
    vozBgDeco = 'bg-amber-500/10';
  } else if (deviation > 1.25) {
    statusColor = 'text-rose-400';
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    badgeText = 'Above Typical';
    numberColor = 'text-rose-100';
    vozNumberColor = 'text-rose-50';
    vozLabelColor = 'text-rose-400';
    borderClass = 'border-rose-900/30';
    vozBorderClass = 'border-rose-900/50';
    vozBgDeco = 'bg-rose-500/10';
  }"""

content = content.replace(old_calc, new_calc)

# 2. Update Vbz Display
old_vbz = """                <div className="bg-slate-950/50 border border-slate-800/50 rounded-xl p-4 relative overflow-hidden">
                  <TooltipLabel label="Breathing Zone Outdoor Air (Vbz)" tooltip="ASHRAE 62.1-2019 Sec 6.2.2.1: Vbz represents the ventilation required directly in the breathing zone for occupants, before accounting for distribution losses." className="text-slate-400 text-xs font-medium mb-0" />
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-slate-300">{Math.ceil(vbz).toLocaleString()}</span>
                    <span className="text-slate-500 text-sm font-semibold">{flowUnit}</span>
                  </div>
                </div>"""

new_vbz = """                <div className={`bg-slate-950/50 border ${borderClass} rounded-xl p-4 relative overflow-hidden transition-colors duration-300`}>
                  <div className="flex justify-between items-start mb-1">
                    <TooltipLabel label="Breathing Zone Outdoor Air (Vbz)" tooltip="ASHRAE 62.1-2019 Sec 6.2.2.1: Vbz represents the ventilation required directly in the breathing zone for occupants, before accounting for distribution losses." className="text-slate-400 text-xs font-medium mb-0" />
                    {!useDefaultDensity && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} transition-colors duration-300`}>
                        {badgeText}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className={`text-2xl font-bold ${numberColor} transition-colors duration-300`}>{Math.ceil(vbz).toLocaleString()}</span>
                    <span className="text-slate-500 text-sm font-semibold">{flowUnit}</span>
                  </div>
                </div>"""

content = content.replace(old_vbz, new_vbz)

# 3. Update ÷ Ez Arrow Color
old_arrow = """                <div className="flex justify-center -my-5 relative z-10 pointer-events-none">
                  <div className="bg-emerald-950/80 backdrop-blur-sm border-[4px] border-slate-900 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center space-x-1">
                    <span>÷ Ez ({zoneEz})</span>
                    <ArrowDown className="w-3 h-3" />
                  </div>
                </div>"""

new_arrow = """                <div className="flex justify-center -my-5 relative z-10 pointer-events-none">
                  <div className={`bg-slate-950/80 backdrop-blur-sm border-[4px] border-slate-900 ${vozLabelColor} text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center space-x-1 transition-colors duration-300`}>
                    <span>÷ Ez ({zoneEz})</span>
                    <ArrowDown className="w-3 h-3" />
                  </div>
                </div>"""

content = content.replace(old_arrow, new_arrow)

# 4. Update Voz Display
old_voz = """                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                  <TooltipLabel label={useTempAdj ? "Required Zone Outdoor Air (Actual Voz)" : "Required Zone Outdoor Air (Standard Voz)"} tooltip="ASHRAE 62.1-2019 Sec 6.2.2.3: Voz represents the total ventilation that must be provided to the zone by the supply system to ensure Vbz is satisfied, accounting for mixing effectiveness (Ez)." className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-0" />
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black text-white tracking-tight">{Math.ceil(voz).toLocaleString()}</span>
                    <span className="text-emerald-400 font-semibold">{flowUnit}</span>
                  </div>
                </div>"""

new_voz = """                <div className={`bg-slate-950 border ${vozBorderClass} rounded-xl p-4 relative overflow-hidden group transition-colors duration-300`}>
                  <div className={`absolute top-0 right-0 w-16 h-16 ${vozBgDeco} rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-all duration-300`} />
                  <TooltipLabel label={useTempAdj ? "Required Zone Outdoor Air (Actual Voz)" : "Required Zone Outdoor Air (Standard Voz)"} tooltip="ASHRAE 62.1-2019 Sec 6.2.2.3: Voz represents the total ventilation that must be provided to the zone by the supply system to ensure Vbz is satisfied, accounting for mixing effectiveness (Ez)." className={`${vozLabelColor} text-xs font-bold uppercase tracking-wider mb-0 transition-colors duration-300`} />
                  <div className="flex items-baseline space-x-2">
                    <span className={`text-4xl font-black ${vozNumberColor} tracking-tight transition-colors duration-300`}>{Math.ceil(voz).toLocaleString()}</span>
                    <span className={`${vozLabelColor} font-semibold transition-colors duration-300`}>{flowUnit}</span>
                  </div>
                </div>"""

content = content.replace(old_voz, new_voz)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
