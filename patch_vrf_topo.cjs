const fs = require('fs');
const file = 'src/components/VrfTopologyCanvas.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/room\.tons\.toFixed/g, '(room.tons || 0).toFixed');
code = code.replace(/edge\.downstreamTons\.toFixed/g, '(edge.downstreamTons || 0).toFixed');
code = code.replace(/hoveredPipe\.downstreamTons\.toFixed/g, '(hoveredPipe.downstreamTons || 0).toFixed');
code = code.replace(/vrfResults\.totalConnectedTons\.toFixed/g, '(vrfResults.totalConnectedTons || 0).toFixed');
code = code.replace(/vrfResults\.coincidentTons\.toFixed/g, '(vrfResults.coincidentTons || 0).toFixed');
code = code.replace(/vrfResults\.oduTons\.toFixed/g, '(vrfResults.oduTons || 0).toFixed');
code = code.replace(/vrfResults\.combinationRatio\.toFixed/g, '(vrfResults.combinationRatio || 0).toFixed');
code = code.replace(/vrfResults\.baseOduCharge\.toFixed/g, '(vrfResults.baseOduCharge || 0).toFixed');
code = code.replace(/vrfResults\.totalCharge\.toFixed/g, '(vrfResults.totalCharge || 0).toFixed');

fs.writeFileSync(file, code);
