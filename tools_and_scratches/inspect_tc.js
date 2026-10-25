const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const tcIdx = js.indexOf('function TC({');
console.log(js.substring(tcIdx, tcIdx + 2000));
