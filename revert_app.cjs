const fs = require('fs');
const file = '/app/applet/src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { useUnit } from './lib/UnitContext';\nimport { motion, AnimatePresence } from 'motion/react';",
  "import { useUnit } from './lib/UnitContext';"
);

content = content.replace(
  '<div className="flex flex-col lg:flex-row gap-8 items-start w-full">',
  '<div className={isSidebarOpen ? "grid grid-cols-1 lg:grid-cols-4 gap-8 items-start" : "w-full"}>'
);

content = content.replace(
  '<div ref={workspaceRef} className="flex-1 min-w-0 w-full bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl transition-all duration-300">',
  '<div ref={workspaceRef} className={`${\n            isSidebarOpen ? \'lg:col-span-3\' : \'w-full\'\n          } bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl transition-all duration-300`}>'
);

content = content.replace(
  '<AnimatePresence>\n          {isSidebarOpen && (\n            <motion.div \n              initial={{ opacity: 0, width: 0, x: 20 }}\n              animate={{ opacity: 1, width: "auto", x: 0 }}\n              exit={{ opacity: 0, width: 0, x: 20 }}\n              transition={{ duration: 0.3 }}\n              className="w-full lg:w-[320px] xl:w-[360px] shrink-0 space-y-6 origin-right"\n            >',
  '{isSidebarOpen && (\n            <div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">'
);

content = content.replace(
  '              <SidebarConversionList />\n            </motion.div>\n          )}\n          </AnimatePresence>',
  '              <SidebarConversionList />\n            </div>\n          )}'
);

fs.writeFileSync(file, content);
