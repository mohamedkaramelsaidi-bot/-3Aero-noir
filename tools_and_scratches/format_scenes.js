const fs = require('fs');

function beautify(code) {
  // Simple beautifier for readability
  return code
    .replace(/;/g, ';\n')
    .replace(/\{/g, '{\n')
    .replace(/\}/g, '\n}\n');
}

const jet = fs.readFileSync('original_assets/assets/jet-scene-Dw6psgr-.js', 'utf8');
fs.writeFileSync('original_assets/jet-scene.formatted.js', beautify(jet.slice(0, 100000)));

const top = fs.readFileSync('original_assets/assets/top-view-scene-C1iUWJYf.js', 'utf8');
fs.writeFileSync('original_assets/top-view-scene.formatted.js', beautify(top.slice(0, 100000)));

console.log('Saved formatted scenes!');
