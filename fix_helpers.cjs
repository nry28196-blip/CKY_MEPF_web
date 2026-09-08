const fs = require('fs');

let code = fs.readFileSync('src/tests/ventilation/ashrae-621-numerical.test.ts', 'utf8');

code = code.replace(/const getSpaceType =.*/, "const getSpaceType = (id: string) => makeVerified(StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === id)!);");
code = code.replace(/const getEzConfig =.*/, "const getEzConfig = (id: string) => makeVerified(StandardDataProvider.get621EzValues('2025').find(e => e.id === id)!);");

fs.writeFileSync('src/tests/ventilation/ashrae-621-numerical.test.ts', code);
