import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# 1. Replace getSewagePipeSize
search_str1 = """  const getSewagePipeSize = (dfu: number, slopePercent: number) => {
    if (dfu <= 0) return { size: 'N/A', reason: 'No drainage load' };
    
    // Implementation of IPC 2018 Table 710.1(1) Building Drains and Sewers
    if (slopePercent === 0.5) { // 1/16 inch per foot
      // 0.5% slope is only allowed for 8" pipes and larger
      if (dfu <= 1400) return { size: 'DN200 (8")', reason: 'IPC Table 710.1(1) min size for 0.5% slope' };
      if (dfu <= 2500) return { size: 'DN250 (10")', reason: 'IPC Table 710.1(1) at 0.5% slope' };
      if (dfu <= 3900) return { size: 'DN300 (12")', reason: 'IPC Table 710.1(1) at 0.5% slope' };
      return { size: 'DN375+ (15"+)', reason: 'IPC Table 710.1(1) at 0.5% slope' };
    } else if (slopePercent === 1.0) { // 1/8 inch per foot
      if (dfu <= 36) return { size: 'DN75 (3")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 180) return { size: 'DN100 (4")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 390) return { size: 'DN125 (5")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 700) return { size: 'DN150 (6")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 1600) return { size: 'DN200 (8")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 2900) return { size: 'DN250 (10")', reason: 'IPC Table 710.1(1) at 1% slope' };
      return { size: 'DN300+ (12"+)', reason: 'IPC Table 710.1(1) high capacity' };
    } else if (slopePercent === 2.0) { // 1/4 inch per foot
      if (dfu <= 21) return { size: 'DN50 (2")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 24) return { size: 'DN65 (2.5")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 42) return { size: 'DN75 (3")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 216) return { size: 'DN100 (4")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 480) return { size: 'DN125 (5")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 840) return { size: 'DN150 (6")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 1920) return { size: 'DN200 (8")', reason: 'IPC Table 710.1(1) at 2% slope' };
      return { size: 'DN250+ (10"+)', reason: 'IPC Table 710.1(1) high capacity' };
    } else { // 4% slope (1/2 inch per foot)
      if (dfu <= 26) return { size: 'DN50 (2")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 31) return { size: 'DN65 (2.5")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 50) return { size: 'DN75 (3")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 250) return { size: 'DN100 (4")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 575) return { size: 'DN125 (5")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 1000) return { size: 'DN150 (6")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 2300) return { size: 'DN200 (8")', reason: 'IPC Table 710.1(1) at 4% slope' };
      return { size: 'DN250+ (10"+)', reason: 'IPC Table 710.1(1) high capacity' };
    }
  };"""

replacement_str1 = """  const getSewagePipeSize = (dfu: number, hasWC: boolean) => {
    if (dfu <= 0) return { size: 'N/A', reason: 'No drainage load' };
    
    // 1.5" pipe
    if (!hasWC && dfu <= 3) return { size: 'DN40 (1.5")', reason: 'Min 1/4" (2%) slope' };
    
    // 2" pipe
    if (!hasWC && dfu <= 21) return { size: 'DN50 (2")', reason: 'Min 1/4" (2%) slope' };
    
    // 2.5" pipe
    if (!hasWC && dfu <= 24) return { size: 'DN65 (2.5")', reason: 'Min 1/4" (2%) slope' };
    
    // 3" pipe (WC minimum is 3")
    if (dfu <= 36) return { size: 'DN75 (3")', reason: 'Min 1/8" (1%) slope' };
    if (dfu <= 42) return { size: 'DN75 (3")', reason: 'Min 1/4" (2%) slope' };
    
    // 4" pipe
    if (dfu <= 180) return { size: 'DN100 (4")', reason: 'Min 1/8" (1%) slope' };
    if (dfu <= 216) return { size: 'DN100 (4")', reason: 'Min 1/4" (2%) slope' };
    if (dfu <= 250) return { size: 'DN100 (4")', reason: 'Min 1/2" (4%) slope' };
    
    // 5" pipe
    if (dfu <= 390) return { size: 'DN125 (5")', reason: 'Min 1/8" (1%) slope' };
    if (dfu <= 480) return { size: 'DN125 (5")', reason: 'Min 1/4" (2%) slope' };
    if (dfu <= 575) return { size: 'DN125 (5")', reason: 'Min 1/2" (4%) slope' };
    
    // 6" pipe
    if (dfu <= 700) return { size: 'DN150 (6")', reason: 'Min 1/8" (1%) slope' };
    if (dfu <= 840) return { size: 'DN150 (6")', reason: 'Min 1/4" (2%) slope' };
    if (dfu <= 1000) return { size: 'DN150 (6")', reason: 'Min 1/2" (4%) slope' };
    
    // 8" pipe
    if (dfu <= 1400) return { size: 'DN200 (8")', reason: 'Min 1/16" (0.5%) slope' };
    if (dfu <= 1600) return { size: 'DN200 (8")', reason: 'Min 1/8" (1%) slope' };
    if (dfu <= 1920) return { size: 'DN200 (8")', reason: 'Min 1/4" (2%) slope' };
    if (dfu <= 2300) return { size: 'DN200 (8")', reason: 'Min 1/2" (4%) slope' };
    
    // 10" pipe
    if (dfu <= 2500) return { size: 'DN250 (10")', reason: 'Min 1/16" (0.5%) slope' };
    if (dfu <= 2900) return { size: 'DN250 (10")', reason: 'Min 1/8" (1%) slope' };
    if (dfu <= 3500) return { size: 'DN250 (10")', reason: 'Min 1/4" (2%) slope' };
    if (dfu <= 4200) return { size: 'DN250 (10")', reason: 'Min 1/2" (4%) slope' };
    
    // 12" pipe
    if (dfu <= 3900) return { size: 'DN300 (12")', reason: 'Min 1/16" (0.5%) slope' };
    if (dfu <= 4600) return { size: 'DN300 (12")', reason: 'Min 1/8" (1%) slope' };
    if (dfu <= 5600) return { size: 'DN300 (12")', reason: 'Min 1/4" (2%) slope' };
    
    return { size: 'DN375+ (15"+)', reason: 'Exceeds standard table capacity' };
  };"""

content = content.replace(search_str1, replacement_str1)


# 2. Replace getBSSewagePipeSize
search_str2 = """  const getBSSewagePipeSize = (du: number, slopePercent: number) => {
    if (du <= 0) return { size: 'N/A', reason: 'No drainage load' };
    
    // BS EN 12056 Peak wastewater flow: Q = K * sqrt(Sum DU)
    // K = 0.7 for standard commercial/public buildings
    const peakDrainageFlow = 0.7 * Math.sqrt(du);
    
    // Minimum diameter for branches serving any WC is DN100 according to BS standards
    if (du <= 4) {
      return { 
        size: 'DN75 (3")', 
        reason: `BS EN 12056 compliant (Light waste branch. Peak: ${peakDrainageFlow.toFixed(2)} L/s)` 
      };
    }
    
    // Capacity limits based on slope and standard drainage tables
    if (slopePercent === 0.5) { // 1:200
      if (peakDrainageFlow <= 3.0) return { size: 'DN100 (4")', reason: `BS EN 12056 compliant at 1:200 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      if (peakDrainageFlow <= 10.0) return { size: 'DN150 (6")', reason: `BS EN 12056 compliant at 1:200 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      return { size: 'DN200 (8")', reason: `BS EN 12056 high load capacity (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    } else if (slopePercent === 1) { // 1:100
      if (peakDrainageFlow <= 4.2) return { size: 'DN100 (4")', reason: `BS EN 12056 compliant at 1:100 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      if (peakDrainageFlow <= 14.5) return { size: 'DN150 (6")', reason: `BS EN 12056 compliant at 1:100 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      return { size: 'DN200 (8")', reason: `BS EN 12056 high load capacity (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    } else { // 2% and above (1:50)
      if (peakDrainageFlow <= 5.8) return { size: 'DN100 (4")', reason: `BS EN 12056 compliant at 1:50 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      if (peakDrainageFlow <= 18.0) return { size: 'DN150 (6")', reason: `BS EN 12056 compliant at 1:50 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      return { size: 'DN200 (8")', reason: `BS EN 12056 high load capacity (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    }
  };"""

replacement_str2 = """  const getBSSewagePipeSize = (du: number, hasWC: boolean) => {
    if (du <= 0) return { size: 'N/A', reason: 'No drainage load' };
    const peakDrainageFlow = 0.7 * Math.sqrt(du);
    
    // For small flows with no WC, we can use DN75
    if (!hasWC && peakDrainageFlow <= 1.5) {
       return { size: 'DN75 (3")', reason: `BS EN 12056 (Min 1:100 slope, Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    }
    
    // Check DN100 capacities
    if (peakDrainageFlow <= 3.0) return { size: 'DN100 (4")', reason: `BS EN 12056 (Min 1:200 slope, Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    if (peakDrainageFlow <= 4.2) return { size: 'DN100 (4")', reason: `BS EN 12056 (Min 1:100 slope, Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    if (peakDrainageFlow <= 5.8) return { size: 'DN100 (4")', reason: `BS EN 12056 (Min 1:50 slope, Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };

    // Check DN150 capacities
    if (peakDrainageFlow <= 10.0) return { size: 'DN150 (6")', reason: `BS EN 12056 (Min 1:200 slope, Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    if (peakDrainageFlow <= 14.5) return { size: 'DN150 (6")', reason: `BS EN 12056 (Min 1:100 slope, Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    if (peakDrainageFlow <= 18.0) return { size: 'DN150 (6")', reason: `BS EN 12056 (Min 1:50 slope, Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };

    return { size: 'DN200+ (8"+)', reason: `BS EN 12056 high load capacity (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
  };"""

content = content.replace(search_str2, replacement_str2)

# 3. Call the updated functions
search_str3 = """  const sewagePipe = appliedStandard === 'bs' 
    ? getBSSewagePipeSize(totalDU, appliedSlope)
    : getSewagePipeSize(totalDFU, appliedSlope);"""
replacement_str3 = """  const hasAnyWC = appliedFixtures.some(f => f.qty > 0 && f.id.includes('wc'));
  const sewagePipe = appliedStandard === 'bs' 
    ? getBSSewagePipeSize(totalDU, hasAnyWC)
    : getSewagePipeSize(totalDFU, hasAnyWC);"""
content = content.replace(search_str3, replacement_str3)

# 4. Remove slope entirely
content = re.sub(r"  const \[slope, setSlope\] = useState<number>\(2\);.*\n", "", content)
content = re.sub(r"  const \[appliedSlope, setAppliedSlope\] = useState<number>\(2\);\n", "", content)
content = re.sub(r"\s*setAppliedSlope\(slope\);\n", "\n", content)
content = re.sub(r"\s*if \(p\.slope\) \{ setSlope\(p\.slope\); setAppliedSlope\(p\.slope\); \}\n", "\n", content)
content = re.sub(r", slope", "", content)
content = re.sub(r"slope, ", "", content)
content = re.sub(r"\s*slope !== appliedSlope \|\|\n", "\n", content)

# 5. Remove slope dropdown from UI
ui_to_remove = """                <div>
                  <TooltipLabel 
                    label="Sewage Main Drain Slope" 
                    tooltip="Minimum slope per IPC to maintain self-cleansing velocity. Typical design range: 1% (1/8 in/ft) for pipes ≥ 3 inches, or 2% (1/4 in/ft) for pipes < 3 inches."
                    className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" 
                  />
                  <select
                    value={slope}
                    onChange={(e) => setSlope(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs font-mono"
                  >
                    <option value={0.5}>0.5% Slope (1:200)</option>
                    <option value={1}>1% Slope (1:100)</option>
                    <option value={2}>2% Slope (1:50)</option>
                    <option value={4}>4% Slope (1:25)</option>
                  </select>
                </div>"""
content = content.replace(ui_to_remove, "")

# 6. Remove slope from summary
content = re.sub(r"\s*`- Sewage Slope: \$\{slope\}%\\n` \+\n", "\n", content)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
