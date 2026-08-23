with open('src/components/VrfLoadDistributionChart.tsx', 'r') as f:
    content = f.read()

import_str = "import React, { useRef, useEffect } from 'react';"
new_import = "import React, { useRef, useEffect, useState } from 'react';"
content = content.replace(import_str, new_import)

hook_str = """  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {"""
new_hook_str = """  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: 300
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {"""

content = content.replace(hook_str, new_hook_str)
content = content.replace("const width = containerRef.current.clientWidth;", "const width = dimensions.width || 300;")

with open('src/components/VrfLoadDistributionChart.tsx', 'w') as f:
    f.write(content)

print("Chart patched")
