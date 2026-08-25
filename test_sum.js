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
    const cFactor = 150;
    const q_m3s = peakFlowLps / 1000;
    const dia = 32;
    const d_m = dia / 1000;
    let equivFittings = 0;
    const totalLength = appliedPipeLength + equivFittings;

    const Hf = 10.67 * Math.pow(q_m3s, 1.85) / (Math.pow(cFactor, 1.85) * Math.pow(d_m, 4.87));
    const frictionLossM = Hf * totalLength;
       
    const totalHeadLossM = frictionLossM + appliedElevationChange;
    const totalHeadLossBar = totalHeadLossM / 10.197;
       
    const residualBar = appliedAvailablePressure - totalHeadLossBar;

    return {
      frictionLossBar: (frictionLossM / 10.197).toFixed(2),
      elevationLossBar: (appliedElevationChange / 10.197).toFixed(2),
      residualBar: residualBar.toFixed(2),
    };
};

const res = calculateHydraulicPipe();
console.log(res);
console.log("Sum:", parseFloat(res.frictionLossBar) + parseFloat(res.elevationLossBar) + parseFloat(res.residualBar));
