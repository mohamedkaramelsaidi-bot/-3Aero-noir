const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

let idx = 0;
while ((idx = js.indexOf('/videos/', idx)) !== -1) {
  console.log('--- FOUND AT ' + idx + ' ---');
  console.log(js.substring(Math.max(0, idx - 200), Math.min(js.length, idx + 300)));
  idx += 8;
}
