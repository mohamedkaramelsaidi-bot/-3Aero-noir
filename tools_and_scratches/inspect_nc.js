const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const ncIdx = js.indexOf('function NC({');
console.log(js.substring(ncIdx, ncIdx + 1500));
