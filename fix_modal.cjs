const fs = require('fs');
let content = fs.readFileSync('src/components/FrictionLossReference.tsx', 'utf8');

content = content.replace(
  '  return (\n    <motion.div',
  '  return (\n    <AnimatePresence>\n      {isOpen && (\n        <motion.div'
);

content = content.replace(
  '        </motion.div>\n      </motion.div>\n  );\n}',
  '        </motion.div>\n      </motion.div>\n      )}\n    </AnimatePresence>\n  );\n}'
);

fs.writeFileSync('src/components/FrictionLossReference.tsx', content);
