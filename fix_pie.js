import fs from 'fs';

const patchFile = (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    
    const newStyleInjection = `
      <style>
        {\`
          .pie-3d-wrapper .recharts-surface {
            overflow: visible;
          }
          .pie-3d-wrapper .recharts-pie {
            transform: perspective(600px) rotateX(50deg);
            transform-origin: 50% 50%;
            filter: drop-shadow(0px 8px 0px rgba(15, 23, 42, 0.9)) drop-shadow(0px 14px 10px rgba(0,0,0,0.6));
          }
        \`}
      </style>
    `;

    content = content.replace(/<style>[\s\S]*?<\/style>/g, newStyleInjection.trim());
    fs.writeFileSync(filepath, content);
}

patchFile('src/components/MechanicalCalc.tsx');
patchFile('src/components/TrendVisualizer.tsx');

console.log('Patched');
