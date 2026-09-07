const fs = require('fs');
const path = require('path');

const modals = [
  'CompareModal.tsx',
  'ReferenceModal.tsx',
  'FireReferenceModal.tsx',
  'IPCReferenceModal.tsx',
  'MaterialOptimizerModal.tsx',
  'VentilationReferenceModal.tsx'
];

const basePath = '/app/applet/src/components';

for (const modalFile of modals) {
  const filePath = path.join(basePath, modalFile);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove import
  content = content.replace("import { motion, AnimatePresence } from 'motion/react';\n", "");

  // Add back `if (!isOpen) return null;`
  // Find where `return (` is and insert it right before.
  if (!content.includes('if (!isOpen) return null;')) {
    content = content.replace(/\n\s*return\s*\(\s*<AnimatePresence>/, '\n  if (!isOpen) return null;\n\n  return (\n    <AnimatePresence>');
  }

  // Restore main structure
  const startRegex = /<AnimatePresence>\s*\{isOpen && \(\s*<div className="fixed inset-0 z-\[100\] flex items-center justify-center p-4 sm:p-6">\s*<motion\.div\s+initial=\{\{ opacity: 0 \}\}\s+animate=\{\{ opacity: 1 \}\}\s+exit=\{\{ opacity: 0 \}\}\s+transition=\{\{ duration: 0\.2 \}\}\s+className="absolute inset-0 bg-slate-950\/85 backdrop-blur-sm"\s+onClick=\{onClose\}\s*\/>\s*<motion\.div\s+initial=\{\{ opacity: 0, scale: 0\.95, y: 10 \}\}\s+animate=\{\{ opacity: 1, scale: 1, y: 0 \}\}\s+exit=\{\{ opacity: 0, scale: 0\.95, y: 10 \}\}\s+transition=\{\{ duration: 0\.2, ease: 'easeOut' \}\}\s+className="([^"]+)"\s*onClick=\{\(e\) => e\.stopPropagation\(\)\}\s*>/s;

  let match = content.match(startRegex);
  if (match) {
    let modalClass = match[1];
    
    // In CompareModal/ReferenceModal, the backdrop had animate-in fade-in.
    // In others, the inner modal had animate-in zoom-in-95
    let backdropClass = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200';
    
    if (modalFile === 'FireReferenceModal.tsx') {
      backdropClass = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200';
      modalClass = 'bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200';
    } else if (modalFile === 'IPCReferenceModal.tsx') {
      backdropClass = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200';
      modalClass = 'bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200';
    } else if (modalFile === 'MaterialOptimizerModal.tsx') {
      backdropClass = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200';
      modalClass = 'bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200';
    } else if (modalFile === 'VentilationReferenceModal.tsx') {
      backdropClass = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200';
      modalClass = 'bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200';
    }

    const replacement = `<div className="${backdropClass}">
      <div 
        className="${modalClass}"
        onClick={(e) => e.stopPropagation()}
      >`;
    
    content = content.replace(match[0], replacement);
    
    // Restore closing tags
    const endRegex = /<\/motion\.div>\s*<\/div>\s*\)\}\s*<\/AnimatePresence>/s;
    content = content.replace(endRegex, '      </div>\n    </div>');
    
    fs.writeFileSync(filePath, content);
    console.log(`Reverted ${modalFile}`);
  } else {
    console.log(`Could not match structure in ${modalFile}`);
  }
}
