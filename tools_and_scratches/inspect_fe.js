const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const feIdx = js.indexOf('function FE(');
console.log(js.substring(feIdx, feIdx + 1500));
