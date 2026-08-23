import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# Replace the getSewagePipeSize function
search_sizing = """  const getSewagePipeSize = (dfu: number, slopePercent: number, hasWC: boolean) => {
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

replace_sizing = """  const getSewagePipeSize = (dfu: number, slopePercent: number, hasWC: boolean) => {
    if (dfu <= 0) return { size: 'N/A', reason: 'No drainage load' };
    
    // IPC 2018 Table 710.1(1) Building Drains and Sewers
    // Evaluates the smallest acceptable pipe size. If the selected slope is too flat for a given pipe size,
    // it returns the pipe size but appends a warning that a steeper slope is required by code.
    
    type PipeCap = { size: string, minSlope: number, cap05: number, cap1: number, cap2: number, cap4: number, noWC?: boolean, maxWCs?: number };
    const pipes: PipeCap[] = [
      { size: 'DN50 (2")', minSlope: 2.0, cap05: 0, cap1: 0, cap2: 21, cap4: 26, noWC: true },
      { size: 'DN65 (2.5")', minSlope: 2.0, cap05: 0, cap1: 0, cap2: 24, cap4: 31, noWC: true },
      { size: 'DN75 (3")', minSlope: 1.0, cap05: 0, cap1: 36, cap2: 42, cap4: 50, maxWCs: 2 },
      { size: 'DN100 (4")', minSlope: 1.0, cap05: 0, cap1: 180, cap2: 216, cap4: 250 },
      { size: 'DN125 (5")', minSlope: 1.0, cap05: 0, cap1: 390, cap2: 480, cap4: 575 },
      { size: 'DN150 (6")', minSlope: 1.0, cap05: 0, cap1: 700, cap2: 840, cap4: 1000 },
      { size: 'DN200 (8")', minSlope: 0.5, cap05: 1400, cap1: 1600, cap2: 1920, cap4: 2300 },
      { size: 'DN250 (10")', minSlope: 0.5, cap05: 2500, cap1: 2900, cap2: 3500, cap4: 4200 },
      { size: 'DN300 (12")', minSlope: 0.5, cap05: 3900, cap1: 4600, cap2: 5600, cap4: 6700 },
      { size: 'DN375 (15")', minSlope: 0.5, cap05: 7000, cap1: 8300, cap2: 10000, cap4: 12000 }
    ];

    for (const p of pipes) {
      if (hasWC && p.noWC) continue;
      
      // Get the capacity at the selected slope, or if the slope is too flat, use the capacity at its min slope
      // to determine if the pipe is physically large enough (though it will require a slope correction)
      const effectiveSlope = Math.max(slopePercent, p.minSlope);
      let capacity = 0;
      if (effectiveSlope === 0.5) capacity = p.cap05;
      else if (effectiveSlope === 1.0) capacity = p.cap1;
      else if (effectiveSlope === 2.0) capacity = p.cap2;
      else if (effectiveSlope >= 4.0) capacity = p.cap4;

      if (dfu <= capacity) {
        if (slopePercent < p.minSlope) {
          return { size: p.size, reason: `IPC 710.1(1) requires min ${p.minSlope}% slope for this size` };
        }
        return { size: p.size, reason: `IPC Table 710.1(1) at ${slopePercent}% slope` };
      }
    }
    
    return { size: 'DN375+ (15"+)', reason: `Exceeds table capacity for ${slopePercent}% slope` };
  };"""

content = content.replace(search_sizing, replace_sizing)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
