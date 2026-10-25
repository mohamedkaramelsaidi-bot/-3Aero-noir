const fs = require('fs');
const path = require('path');

const mapFiles = [
  'sourcemaps/assets/index-D9t9AB3n.js.map',
  'sourcemaps/assets/jet-scene-Dw6psgr-.js.map',
  'sourcemaps/assets/top-view-scene-C1iUWJYf.js.map'
];

for (const mapFile of mapFiles) {
  console.log(`\nUnpacking ${mapFile}...`);
  const raw = fs.readFileSync(mapFile, 'utf8');
  const map = JSON.parse(raw);
  
  if (!map.sources || !map.sourcesContent) {
    console.log(`No sources/sourcesContent in ${mapFile}`);
    continue;
  }

  for (let i = 0; i < map.sources.length; i++) {
    let sourcePath = map.sources[i];
    const content = map.sourcesContent[i];
    
    if (!content) continue;

    // Clean up sourcePath
    // Often starts with '../' or 'vite/' or 'src/'
    sourcePath = sourcePath.replace(/^(\.\.\/)+/, '');
    sourcePath = sourcePath.replace(/^vite\//, 'extracted_vite/');
    
    // Only extract project source files (skip pure node_modules if we want, or extract src/)
    if (sourcePath.startsWith('src/') || sourcePath.endsWith('.tsx') || sourcePath.endsWith('.ts') || sourcePath.endsWith('.jsx') || sourcePath.endsWith('.js') || sourcePath.endsWith('.css') || sourcePath.endsWith('.html')) {
      const target = path.join('extracted_src', sourcePath);
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(target, content, 'utf8');
      console.log(`Extracted: ${sourcePath}`);
    }
  }
}
