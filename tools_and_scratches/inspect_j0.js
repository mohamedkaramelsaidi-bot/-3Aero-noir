const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const j0Idx = js.indexOf('J0=');
console.log(js.substring(j0Idx - 200, j0Idx + 600));
