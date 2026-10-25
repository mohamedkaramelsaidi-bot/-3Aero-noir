const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const idx = js.indexOf('toggleSound(){');
console.log(js.substring(idx - 100, idx + 800));
