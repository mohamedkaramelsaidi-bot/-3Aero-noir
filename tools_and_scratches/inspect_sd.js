const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

// Find function SD
const sdIdx = js.indexOf('function SD(');
console.log('function SD at:', sdIdx);
if (sdIdx !== -1) {
  console.log(js.substring(sdIdx, sdIdx + 2000));
} else {
  // Let's search for "const SD" or "var SD"
  const m = js.match(/(function|const|var|let)\s+SD\b[^=({]*[=({]/);
  console.log('SD match:', m);
  if (m) {
    const idx = js.indexOf(m[0]);
    console.log(js.substring(idx, idx + 2000));
  }
}
