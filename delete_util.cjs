const fs = require('fs');
if (fs.existsSync('src/components/AirDensityUtility.tsx')) {
    fs.unlinkSync('src/components/AirDensityUtility.tsx');
}
