const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const ccIdx = js.indexOf('function CC(){');
console.log(js.substring(ccIdx, ccIdx + 3000));
