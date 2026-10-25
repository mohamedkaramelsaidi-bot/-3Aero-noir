const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const weIdx = js.indexOf('dg.map((lt,G)=>{');
console.log(js.substring(weIdx, weIdx + 2000));
