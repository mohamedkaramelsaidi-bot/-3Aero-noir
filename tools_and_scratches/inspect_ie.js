const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const ieIdx = js.indexOf('IE=');
console.log(js.substring(ieIdx - 100, ieIdx + 600));
