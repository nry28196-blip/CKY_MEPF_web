const fs = require('fs');
const file = '/app/applet/src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('            </motion.div>\n          )}\n          </AnimatePresence>', '            </div>\n          )}');

fs.writeFileSync(file, content);
