const peakFlowLps = 1.0;
const appliedPipeMaterial = 'pvc';
const appliedElevationChange = 5;
const appliedAvailablePressure = 4.0;
const appliedRequiredResidual = 1.5;
const appliedDesignVelocity = 2.0;
const appliedPipeLength = 100;
const appliedFittings = [];
const FITTING_TYPES = [];

const calculateHydraulicPipe = () => {
    if (peakFlowLps <= 0) return null;
    const cFactor = appliedPipeMaterial === 'pvc' ? 150 : appliedPipeMaterial === 'copper' ? 140 : 120;
    const q_m3s = peakFlowLps / 1000;
       
    const sizes = [15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200];
    const minVelocityDiaMm = Math.sqrt((4 * q_m3s) / (Math.PI * appliedDesignVelocity)) * 1000;
    
    let finalDiaMm = sizes[sizes.length - 1];
    let hydraulicDetails = null;

    for (const dia of sizes) {
      if (dia < minVelocityDiaMm) continue;

      const d_m = dia / 1000;
      let equivFittings = 0;
      const totalLength = appliedPipeLength + equivFittings;

      // Metric Hazen-Williams
      const Hf = 10.67 * Math.pow(q_m3s, 1.85) / (Math.pow(cFactor, 1.85) * Math.pow(d_m, 4.87));
      const frictionLossM = Hf * totalLength;
         
      const totalHeadLossM = frictionLossM + appliedElevationChange;
      const totalHeadLossBar = totalHeadLossM / 10.197;
         
      const residualBar = appliedAvailablePressure - totalHeadLossBar;

      if (residualBar >= appliedRequiredResidual) {
        finalDiaMm = dia;
        hydraulicDetails = {
          size: `${dia} mm (DN${dia})`,
          frictionLossBar: (frictionLossM / 10.197).toFixed(2),
          elevationLossBar: (appliedElevationChange / 10.197).toFixed(2),
          residualBar: residualBar.toFixed(2),
          totalLength: totalLength.toFixed(1),
          equivFittings: equivFittings.toFixed(1),
        };
        break;
      }
    }
    return hydraulicDetails;
};

console.log(calculateHydraulicPipe());
