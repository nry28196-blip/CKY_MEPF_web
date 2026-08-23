import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

search_str = """  // Sewage Pipe size based on IPC Table 710.1(1) and slope
  const getSewagePipeSize = (dfu: number, slopePercent: number) => {
    if (dfu <= 0) return { size: 'N/A', reason: 'No drainage load' };
    
    // Light Loads
    if (dfu <= 3) return { size: 'DN40 (1.5")', reason: 'IPC Table 710.1 compliant (Branch size limit)' };
    if (dfu <= 6) return { size: 'DN50 (2")', reason: 'IPC Table 710.1 compliant' };
    if (dfu <= 20) return { size: 'DN75 (3")', reason: 'IPC Table 710.1 compliant (Minimum size for WCs)' };
    
    // High Loads depending on slope
    if (slopePercent === 0.5) {
      if (dfu <= 180) return { size: 'DN100 (4")', reason: 'IPC Table 710.1 at 0.5% slope' };
      if (dfu <= 700) return { size: 'DN150 (6")', reason: 'IPC Table 710.1 at 0.5% slope' };
      return { size: 'DN200 (8")', reason: 'High capacity drainage standard' };
    } else if (slopePercent === 1) {
      if (dfu <= 160) return { size: 'DN100 (4")', reason: 'IPC Table 710.1 at 1% slope' };
      if (dfu <= 960) return { size: 'DN150 (6")', reason: 'IPC Table 710.1 at 1% slope' };
      return { size: 'DN200 (8")', reason: 'High capacity drainage standard' };
    } else if (slopePercent === 2) {
      if (dfu <= 216) return { size: 'DN100 (4")', reason: 'IPC Table 710.1 at 2% slope' };
      if (dfu <= 1400) return { size: 'DN150 (6")', reason: 'IPC Table 710.1 at 2% slope' };
      return { size: 'DN200 (8")', reason: 'High capacity drainage standard' };
    } else { // 4% slope
      if (dfu <= 250) return { size: 'DN100 (4")', reason: 'IPC Table 710.1 at 4% slope' };
      if (dfu <= 2200) return { size: 'DN150 (6")', reason: 'IPC Table 710.1 at 4% slope' };
      return { size: 'DN200 (8")', reason: 'High capacity drainage standard' };
    }
  };"""

replacement_str = """  // Sewage Pipe size based on IPC Table 710.1(1) and slope
  const getSewagePipeSize = (dfu: number, slopePercent: number) => {
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

if search_str in content:
    content = content.replace(search_str, replacement_str)
    with open('src/components/PlumbingCalc.tsx', 'w') as f:
        f.write(content)
    print("Patched getSewagePipeSize successfully")
else:
    print("getSewagePipeSize string not found")

