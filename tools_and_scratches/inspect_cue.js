const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const qeIdx = js.indexOf('cue(i){');
console.log(js.substring(qeIdx, qeIdx + 1200));
