const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const startIdx = js.indexOf('class QE{');
const endIdx = js.indexOf('class YE{');
console.log(js.substring(startIdx, endIdx));
