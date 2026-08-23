import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

search_str = """  const getBSSewagePipeSize = (du: number, hasWC: boolean) => {
    if (du <= 0) return { size: 'N/A', reason: 'No drainage load' };
    const peakDrainageFlow = 0.7 * Math.sqrt(du);
    
    // For small flows with no WC, we can use DN75
    if (!hasWC && peakDrainageFlow <= 1.5) {
       return { size: 'DN75 (3")', reason: `BS EN 12056 (Min 1:100 Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    }
    
    // Check DN100 capacities
    if (peakDrainageFlow <= 3.0) return { size: 'DN100 (4")', reason: `BS EN 12056 (Min 1:200 Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    if (peakDrainageFlow <= 4.2) return { size: 'DN100 (4")', reason: `BS EN 12056 (Min 1:100 Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    if (peakDrainageFlow <= 5.8) return { size: 'DN100 (4")', reason: `BS EN 12056 (Min 1:50 Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };

    // Check DN150 capacities
    if (peakDrainageFlow <= 10.0) return { size: 'DN150 (6")', reason: `BS EN 12056 (Min 1:200 Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    if (peakDrainageFlow <= 14.5) return { size: 'DN150 (6")', reason: `BS EN 12056 (Min 1:100 Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    if (peakDrainageFlow <= 18.0) return { size: 'DN150 (6")', reason: `BS EN 12056 (Min 1:50 Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };

    return { size: 'DN200+ (8"+)', reason: `BS EN 12056 high load capacity (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
  };"""

replacement_str = """  const getBSSewagePipeSize = (du: number, slopePercent: number, hasWC: boolean) => {
    if (du <= 0) return { size: 'N/A', reason: 'No drainage load' };
    const peakDrainageFlow = 0.7 * Math.sqrt(du);
    
    if (slopePercent === 0.5) { // 1:200
      if (peakDrainageFlow <= 3.0) return { size: 'DN100 (4")', reason: `BS EN 12056 at 1:200 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      if (peakDrainageFlow <= 10.0) return { size: 'DN150 (6")', reason: `BS EN 12056 at 1:200 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      return { size: 'DN200+ (8"+)', reason: `BS EN 12056 at 1:200 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    } else if (slopePercent === 1.0) { // 1:100
      if (!hasWC && peakDrainageFlow <= 1.5) return { size: 'DN75 (3")', reason: `BS EN 12056 at 1:100 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      if (peakDrainageFlow <= 4.2) return { size: 'DN100 (4")', reason: `BS EN 12056 at 1:100 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      if (peakDrainageFlow <= 14.5) return { size: 'DN150 (6")', reason: `BS EN 12056 at 1:100 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      return { size: 'DN200+ (8"+)', reason: `BS EN 12056 at 1:100 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    } else { // 1:50 (2%) or higher
      if (!hasWC && peakDrainageFlow <= 1.5) return { size: 'DN75 (3")', reason: `BS EN 12056 at 1:50 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      if (peakDrainageFlow <= 5.8) return { size: 'DN100 (4")', reason: `BS EN 12056 at 1:50 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      if (peakDrainageFlow <= 18.0) return { size: 'DN150 (6")', reason: `BS EN 12056 at 1:50 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      return { size: 'DN200+ (8"+)', reason: `BS EN 12056 at 1:50 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    }
  };"""

if search_str in content:
    content = content.replace(search_str, replacement_str)
    print("Patched BS EN calculation successfully")
else:
    print("Failed to find BS EN calculation injection point")

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)

