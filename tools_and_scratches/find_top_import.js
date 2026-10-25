const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

let idx = 0;
while ((idx = js.indexOf('top-view-scene', idx)) !== -1) {
  console.log(`Found top-view-scene at ${idx}:`);
  console.log(js.substring(Math.max(0, idx - 200), Math.min(js.length, idx + 400)));
  idx += 15;
}
