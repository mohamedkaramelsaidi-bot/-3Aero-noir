const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const nxIdx = js.indexOf('function Nx(');
console.log('Nx function:');
console.log(js.substring(nxIdx, nxIdx + 800));

const jxIdx = js.indexOf('function jx(');
console.log('jx function:');
console.log(js.substring(jxIdx, jxIdx + 1200));
