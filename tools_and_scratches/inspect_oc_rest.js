const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const ocIdx = js.indexOf('function OC(){');
const vDIdx = js.indexOf('function vD(){');
console.log(js.substring(ocIdx + 2000, vDIdx));
