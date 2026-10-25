const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const scIdx = js.indexOf('function SC({');
console.log(js.substring(scIdx, scIdx + 2500));
