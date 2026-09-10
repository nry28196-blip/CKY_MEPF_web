import fs from 'fs';
const file = 'src/tests/ventilation/dataset-sanity.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/from '\.\.\/\.\.\/data\/ventilation\/ashrae621\/2019\/ez';/g, "from '../../data/ventilation/ashrae621/2019/data';");
content = content.replace(/from '\.\.\/\.\.\/data\/ventilation\/ashrae621\/2022\/ez';/g, "from '../../data/ventilation/ashrae621/2022/data';");
content = content.replace(/from '\.\.\/\.\.\/data\/ventilation\/ashrae621\/2025\/ez';/g, "from '../../data/ventilation/ashrae621/2025/data';");

fs.writeFileSync(file, content);
