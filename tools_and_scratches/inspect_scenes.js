const fs = require('fs');

const jet = fs.readFileSync('original_assets/assets/jet-scene-Dw6psgr-.js', 'utf8');
const top = fs.readFileSync('original_assets/assets/top-view-scene-C1iUWJYf.js', 'utf8');

function findAssets(content, name) {
  const regex = /['"`]([^'"`\s]+\.(glb|gltf|bin|hdr|png|jpg|webp|svg|mp3|mp4))['"`]/gi;
  let m;
  const set = new Set();
  while ((m = regex.exec(content)) !== null) {
    set.add(m[1]);
  }
  console.log(`Assets in ${name}:`, [...set]);
}

findAssets(jet, 'jet-scene');
findAssets(top, 'top-view-scene');
