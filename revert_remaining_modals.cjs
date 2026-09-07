const fs = require('fs');

// StaticPressureCalc.tsx
const spFile = '/app/applet/src/components/StaticPressureCalc.tsx';
let spContent = fs.readFileSync(spFile, 'utf8');
spContent = spContent.replace("import { motion, AnimatePresence } from 'motion/react';\n", "");

const spStartRegex = /<AnimatePresence>\s*\{fittingSelectorOpen && \(\s*<div className="fixed inset-0 z-50 flex items-center justify-center p-4">\s*<motion\.div\s+initial=\{\{ opacity: 0 \}\}\s+animate=\{\{ opacity: 1 \}\}\s+exit=\{\{ opacity: 0 \}\}\s+transition=\{\{ duration: 0\.2 \}\}\s+className="absolute inset-0 bg-slate-950\/80 backdrop-blur-sm"\s+onClick=\{\(\) => setFittingSelectorOpen\(null\)\}\s*\/>\s*<motion\.div\s+initial=\{\{ opacity: 0, scale: 0\.95, y: 10 \}\}\s+animate=\{\{ opacity: 1, scale: 1, y: 0 \}\}\s+exit=\{\{ opacity: 0, scale: 0\.95, y: 10 \}\}\s+transition=\{\{ duration: 0\.2, ease: 'easeOut' \}\}\s+className="relative bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full max-h-\[80vh\] flex flex-col shadow-2xl"\s*>/s;

let spMatch = spContent.match(spStartRegex);
if (spMatch) {
  spContent = spContent.replace(spMatch[0], `{fittingSelectorOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl">`);
          
  const spEndRegex = /<\/motion\.div>\s*<\/div>\s*\)\}\s*<\/AnimatePresence>/s;
  spContent = spContent.replace(spEndRegex, '          </div>\n        </div>\n      )}');
  fs.writeFileSync(spFile, spContent);
  console.log('Reverted StaticPressureCalc.tsx');
}

// CoolingLoadReference.tsx
const clFile = '/app/applet/src/components/CoolingLoadReference.tsx';
let clContent = fs.readFileSync(clFile, 'utf8');
clContent = clContent.replace("import { motion, AnimatePresence } from 'motion/react';\n", "");

if (!clContent.includes('if (!isOpen) return null;')) {
  clContent = clContent.replace(/\n\s*return\s*\(\s*<AnimatePresence>/, '\n  if (!isOpen) return null;\n\n  return (\n    <AnimatePresence>');
}

const clStartRegex = /<AnimatePresence>\s*\{isOpen && \(\s*<div className="fixed inset-0 z-\[100\] flex items-center justify-center p-4 sm:p-6">\s*<motion\.div\s+initial=\{\{ opacity: 0 \}\}\s+animate=\{\{ opacity: 1 \}\}\s+exit=\{\{ opacity: 0 \}\}\s+className="absolute inset-0 bg-slate-950\/80 backdrop-blur-sm"\s+onClick=\{onClose\}\s*\/>\s*<motion\.div\s+initial=\{\{ opacity: 0, scale: 0\.95, y: 10 \}\}\s+animate=\{\{ opacity: 1, scale: 1, y: 0 \}\}\s+exit=\{\{ opacity: 0, scale: 0\.95, y: 10 \}\}\s+transition=\{\{ type: 'spring', damping: 25, stiffness: 300 \}\}\s+className="bg-slate-900 border border-slate-700\/50 rounded-2xl w-full max-w-2xl max-h-\[85vh\] flex flex-col shadow-2xl overflow-hidden relative"\s+onClick=\{\(e\) => e\.stopPropagation\(\)\}\s*>/s;

let clMatch = clContent.match(clStartRegex);
if (clMatch) {
  clContent = clContent.replace(clMatch[0], `<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div
          className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >`);
  
  const clEndRegex = /<\/motion\.div>\s*<\/div>\s*\)\}\s*<\/AnimatePresence>/s;
  clContent = clContent.replace(clEndRegex, '        </div>\n      </div>');
  fs.writeFileSync(clFile, clContent);
  console.log('Reverted CoolingLoadReference.tsx');
}

// FrictionLossReference.tsx
const flFile = '/app/applet/src/components/FrictionLossReference.tsx';
let flContent = fs.readFileSync(flFile, 'utf8');
flContent = flContent.replace("import { motion, AnimatePresence } from 'motion/react';\n", "");

if (!flContent.includes('if (!isOpen) return null;')) {
  flContent = flContent.replace(/\n\s*return\s*\(\s*<AnimatePresence>/, '\n  if (!isOpen) return null;\n\n  return (\n    <AnimatePresence>');
}

const flStartRegex = /<AnimatePresence>\s*\{isOpen && \(\s*<div className="fixed inset-0 z-\[100\] flex items-center justify-center p-4 sm:p-6">\s*<motion\.div\s+initial=\{\{ opacity: 0 \}\}\s+animate=\{\{ opacity: 1 \}\}\s+exit=\{\{ opacity: 0 \}\}\s+transition=\{\{ duration: 0\.2 \}\}\s+className="absolute inset-0 bg-slate-950\/80 backdrop-blur-sm"\s+onClick=\{onClose\}\s*\/>\s*<motion\.div\s+initial=\{\{ opacity: 0, scale: 0\.95, y: 10 \}\}\s+animate=\{\{ opacity: 1, scale: 1, y: 0 \}\}\s+exit=\{\{ opacity: 0, scale: 0\.95, y: 10 \}\}\s+transition=\{\{ type: 'spring', damping: 25, stiffness: 300 \}\}\s+className="bg-slate-900 border border-slate-700\/50 rounded-2xl w-full max-w-2xl max-h-\[85vh\] flex flex-col shadow-2xl overflow-hidden relative"\s+onClick=\{\(e\) => e\.stopPropagation\(\)\}\s*>/s;

let flMatch = flContent.match(flStartRegex);
if (flMatch) {
  flContent = flContent.replace(flMatch[0], `<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
        <div
          className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >`);
  
  const flEndRegex = /<\/motion\.div>\s*<\/div>\s*\)\}\s*<\/AnimatePresence>/s;
  flContent = flContent.replace(flEndRegex, '        </div>\n      </div>');
  fs.writeFileSync(flFile, flContent);
  console.log('Reverted FrictionLossReference.tsx');
}

