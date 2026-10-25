const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const regex = /["'](\.\/[^"']+\.js|\/assets\/[^"']+\.js|[a-zA-Z0-9_-]+\-[a-zA-Z0-9_-]+\.js)["']/g;
let m;
const chunks = new Set();
while ((m = regex.exec(js)) !== null) {
  chunks.add(m[1]);
}
console.log('Dynamic chunks:', [...chunks]);

// Also look for __vite__mapDeps
const mapDepsRegex = /__vite__mapDeps\(\[([^\]]+)\]\)/g;
while ((m = mapDepsRegex.exec(js)) !== null) {
  console.log('mapDeps:', m[0]);
}

// Find __vite__mapDeps definition
const defIdx = js.indexOf('__vite__mapDeps');
if (defIdx !== -1) {
  console.log('mapDeps definition:', js.substring(defIdx, defIdx + 500));
}
