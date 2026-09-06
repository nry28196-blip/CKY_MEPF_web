const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Create directories
ensureDir('src/data/ventilation/ashrae621/2019');
ensureDir('src/data/ventilation/ashrae621/2022');
ensureDir('src/data/ventilation/ashrae621/2025');
ensureDir('src/data/ventilation/ashrae622/2019');
ensureDir('src/data/ventilation/ashrae622/2022');
ensureDir('src/data/ventilation/ashrae622/2025');
ensureDir('src/calculations/ventilation');
ensureDir('src/services');
ensureDir('src/tests/ventilation');

console.log("Directories created.");
