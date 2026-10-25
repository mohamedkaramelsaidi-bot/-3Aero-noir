const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const jeIdx = js.indexOf('function JE({');
console.log(js.substring(jeIdx, jeIdx + 1200));
