const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const weIdx = js.indexOf('function WE(){');
const ecIdx = js.indexOf('function EC(){');
console.log(js.substring(weIdx, weIdx + 4000));
