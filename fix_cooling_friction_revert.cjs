const fs = require('fs');

// CoolingLoadReference.tsx original state had AnimatePresence
const clFile = '/app/applet/src/components/CoolingLoadReference.tsx';
let clContent = fs.readFileSync(clFile, 'utf8');
if (!clContent.includes("from 'motion/react'")) {
  clContent = clContent.replace("import React", "import { motion, AnimatePresence } from 'motion/react';\nimport React");
}
// Remove the added `if (!isOpen) return null;`
clContent = clContent.replace(/\n\s*if \(!isOpen\) return null;/g, '');

// The original return structure was:
const clTarget = `<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div
          className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >`;

const clReplace = `<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >`;

clContent = clContent.replace(clTarget, clReplace);
clContent = clContent.replace('        </div>\n      </div>', '        </motion.div>\n      </div>');
fs.writeFileSync(clFile, clContent);

// FrictionLossReference.tsx
const flFile = '/app/applet/src/components/FrictionLossReference.tsx';
let flContent = fs.readFileSync(flFile, 'utf8');
if (!flContent.includes("from 'motion/react'")) {
  flContent = flContent.replace("import React", "import { motion, AnimatePresence } from 'motion/react';\nimport React");
}
flContent = flContent.replace(/\n\s*if \(!isOpen\) return null;/g, '');

const flTarget = `<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
        <div
          className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >`;

const flReplace = `<motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >`;

flContent = flContent.replace(flTarget, flReplace);
flContent = flContent.replace('        </div>\n      </div>', '        </motion.div>\n      </motion.div>');
fs.writeFileSync(flFile, flContent);

