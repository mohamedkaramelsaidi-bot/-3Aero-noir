const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const xdIdx = js.indexOf('function xD(){');
console.log(js.substring(xdIdx, xdIdx + 2000));
