const fs = require('fs');
const gltf = fs.readFileSync('original_assets/assets/GLTFLoader-BcfhmKiC.js', 'utf8');
console.log('GLTF loader exports length:', gltf.length);
console.log('Exports in GLTF loader:', gltf.substring(gltf.lastIndexOf('export')));
