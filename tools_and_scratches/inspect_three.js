const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

// Find occurrences of WebGLRenderer or Scene or PerspectiveCamera
const terms = ['WebGLRenderer', 'Scene', 'PerspectiveCamera', 'ShaderMaterial', 'BufferGeometry'];
terms.forEach(t => {
  let idx = 0;
  let count = 0;
  while ((idx = js.indexOf(t, idx)) !== -1) {
    if (count < 2) {
      console.log(`Match for ${t} at ${idx}:`);
      console.log(js.substring(Math.max(0, idx - 100), Math.min(js.length, idx + 200)));
    }
    count++;
    idx += t.length;
  }
  console.log(`Total ${t}: ${count}`);
});
