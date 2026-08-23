import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

search_str = """  // Sewage Pipe size based on IPC Table 710.1(1) and slope
  const getSewagePipeSize = (dfu: number, hasWC: boolean) => {
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

replacement_str = """  // Sewage Pipe size based on IPC Table 710.1(1) and slope
  const getSewagePipeSize = (dfu: number, slopePercent: number, hasWC: boolean) => {
    if (dfu <= 0) return { size: 'N/A', reason: 'No drainage load' };
    
    // Implementation of IPC 2018 Table 710.1(1) Building Drains and Sewers
    // Check sizes based on explicit slope parameter
    
    if (slopePercent === 0.5) { // 1/16 inch per foot
      if (dfu <= 1400) return { size: 'DN200 (8")', reason: 'IPC Table 710.1(1) at 0.5% slope (Min allowed for 0.5%)' };
      if (dfu <= 2500) return { size: 'DN250 (10")', reason: 'IPC Table 710.1(1) at 0.5% slope' };
      if (dfu <= 3900) return { size: 'DN300 (12")', reason: 'IPC Table 710.1(1) at 0.5% slope' };
      if (dfu <= 7000) return { size: 'DN375 (15")', reason: 'IPC Table 710.1(1) at 0.5% slope' };
      return { size: 'DN375+ (15"+)', reason: 'Exceeds table capacity for 0.5% slope' };
    } 
    
    else if (slopePercent === 1.0) { // 1/8 inch per foot
      if (dfu <= 36) return { size: 'DN75 (3")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 180) return { size: 'DN100 (4")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 390) return { size: 'DN125 (5")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 700) return { size: 'DN150 (6")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 1600) return { size: 'DN200 (8")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 2900) return { size: 'DN250 (10")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 4600) return { size: 'DN300 (12")', reason: 'IPC Table 710.1(1) at 1% slope' };
      if (dfu <= 8300) return { size: 'DN375 (15")', reason: 'IPC Table 710.1(1) at 1% slope' };
      return { size: 'DN375+ (15"+)', reason: 'Exceeds table capacity for 1% slope' };
    } 
    
    else if (slopePercent === 2.0) { // 1/4 inch per foot
      if (!hasWC && dfu <= 21) return { size: 'DN50 (2")', reason: 'IPC Table 710.1(1) at 2% slope (No WCs allowed)' };
      if (!hasWC && dfu <= 24) return { size: 'DN65 (2.5")', reason: 'IPC Table 710.1(1) at 2% slope (No WCs allowed)' };
      if (dfu <= 42) return { size: 'DN75 (3")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 216) return { size: 'DN100 (4")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 480) return { size: 'DN125 (5")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 840) return { size: 'DN150 (6")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 1920) return { size: 'DN200 (8")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 3500) return { size: 'DN250 (10")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 5600) return { size: 'DN300 (12")', reason: 'IPC Table 710.1(1) at 2% slope' };
      if (dfu <= 10000) return { size: 'DN375 (15")', reason: 'IPC Table 710.1(1) at 2% slope' };
      return { size: 'DN375+ (15"+)', reason: 'Exceeds table capacity for 2% slope' };
    } 
    
    else { // 4% slope (1/2 inch per foot)
      if (!hasWC && dfu <= 26) return { size: 'DN50 (2")', reason: 'IPC Table 710.1(1) at 4% slope (No WCs allowed)' };
      if (!hasWC && dfu <= 31) return { size: 'DN65 (2.5")', reason: 'IPC Table 710.1(1) at 4% slope (No WCs allowed)' };
      if (dfu <= 50) return { size: 'DN75 (3")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 250) return { size: 'DN100 (4")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 575) return { size: 'DN125 (5")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 1000) return { size: 'DN150 (6")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 2300) return { size: 'DN200 (8")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 4200) return { size: 'DN250 (10")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 6700) return { size: 'DN300 (12")', reason: 'IPC Table 710.1(1) at 4% slope' };
      if (dfu <= 12000) return { size: 'DN375 (15")', reason: 'IPC Table 710.1(1) at 4% slope' };
      return { size: 'DN375+ (15"+)', reason: 'Exceeds table capacity for 4% slope' };
    }
  };"""

if search_str in content:
    content = content.replace(search_str, replacement_str)
    print("Patched sewage pipe calculation successfully")
else:
    print("Failed to find sewage pipe calculation injection point")

# Also fix the call:
search_call = """  const sewagePipe = appliedStandard === 'bs' 
    ? getBSSewagePipeSize(totalDU, hasAnyWC) 
    : getSewagePipeSize(totalDFU, hasAnyWC);"""

replace_call = """  const sewagePipe = appliedStandard === 'bs' 
    ? getBSSewagePipeSize(totalDU, appliedSlope, hasAnyWC) 
    : getSewagePipeSize(totalDFU, appliedSlope, hasAnyWC);"""

content = content.replace(search_call, replace_call)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)

