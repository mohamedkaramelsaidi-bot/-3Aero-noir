const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const j0Idx = js.indexOf('const J0=');
console.log(js.substring(j0Idx - 1200, j0Idx));
