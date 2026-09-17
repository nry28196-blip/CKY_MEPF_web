import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-2022-density-propagation.test.ts';
let content = fs.readFileSync(file, 'utf8');

// The file might end with one too many '});'
content = content.replace(/  \}\);\n\}\);\n$/g, '  });\n});\n');
content = content.trim(); // Just check ending

if (content.endsWith('});\n});')) {
  // Good
} else if (content.endsWith('});\n});\n});')) {
  content = content.slice(0, content.length - 4);
} else if (content.endsWith('});\n});\n});\n')) {
  content = content.slice(0, content.length - 5);
}

fs.writeFileSync(file, content);
