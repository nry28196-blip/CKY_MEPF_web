const fs = require('fs');

function fixNotesInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // A simple regex replacement for notes: 'Verified', when the item is UNVERIFIED_DRAFT
  content = content.replace(/notes:\s*'Verified'/g, "notes: 'Not verified against current published source.'");
  
  fs.writeFileSync(filePath, content);
}

fixNotesInFile('src/data/ventilation/ashrae621/2025/data.ts');
