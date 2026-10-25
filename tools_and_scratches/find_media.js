const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const regex = /['"`]([^'"`]*\.(glb|gltf|bin|hdr|mp4|webm|json|svg))['"`]/gi;
let m;
const set = new Set();
while ((m = regex.exec(js)) !== null) {
  set.add(m[1]);
}
console.log('Media/3D/Model matches:');
console.log([...set]);
