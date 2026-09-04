const fs = require('fs');

let content = fs.readFileSync('src/components/Ashrae621ExhaustCalc.tsx', 'utf8');

// The current evaluateRows function has manual extraction. We will replace it.
const oldEvaluateRows = `  const evaluateRows = () => {
    return rows.map(r => {
      const space = Ashrae621ExhaustService.getSpaceById(r.categoryId, edition as AshraeEdition) || allSpaces[0];
      const ashraeRate = isMetric ? space.ashraeRateMet : space.ashraeRateImp;
      const imcRate = isMetric ? space.imcRateMet : space.imcRateImp;
      
      const ashraeTotal = r.quantity * ashraeRate;
      const imcTotal = r.quantity * imcRate;

      return {
        row: r,
        space,
        result: Ashrae621ExhaustService.evaluateSpace({
          ashraeRate: ashraeTotal,
          imcRate: imcTotal,
          projectRate: r.projectTotal,
          mfgRate: r.mfgTotal,
          ashraeClass: space.ashraeClass
        })
      };
    });
  };`;

const newEvaluateRows = `  const evaluateRows = () => {
    return rows.map(r => {
      const space = Ashrae621ExhaustService.getSpaceById(r.categoryId, edition as AshraeEdition) || allSpaces[0];
      
      // The service encapsulates the logic to look up the rates and determine the governing rate
      const result = Ashrae621ExhaustService.calculateSpaceExhaust({
        spaceId: r.categoryId,
        edition: edition as AshraeEdition,
        quantity: r.quantity,
        isMetric,
        projectOverride: r.projectTotal,
        mfgOverride: r.mfgTotal
      });

      return {
        row: r,
        space,
        result
      };
    });
  };`;

content = content.replace(oldEvaluateRows, newEvaluateRows);

fs.writeFileSync('src/components/Ashrae621ExhaustCalc.tsx', content);
