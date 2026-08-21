import fs from 'fs';

const patchFile = (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    
    const newStyleInjection = `
      <style>
        {\`
          .pie-3d-wrapper .recharts-surface {
            overflow: visible;
            transform: perspective(600px) rotateX(50deg);
            transform-style: preserve-3d;
          }
          .pie-3d-wrapper .recharts-pie {
            filter: drop-shadow(0px 10px 0px rgba(2, 6, 23, 0.9)) drop-shadow(0px 20px 10px rgba(0,0,0,0.6));
          }
          /* Ensure labels don't get the shadow but maybe a subtle one for readability */
          .pie-3d-wrapper .recharts-pie-labels text {
             filter: none;
             text-shadow: 0px 1px 2px rgba(0,0,0,0.8);
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
