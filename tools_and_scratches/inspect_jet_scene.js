const fs = require('fs');

const jet = fs.readFileSync('original_assets/assets/jet-scene-Dw6psgr-.js', 'utf8');

// Find class JetScene or function JetScene
const match = jet.match(/(class\s+JetScene|function\s+JetScene)[^\{]*\{/);
console.log('JetScene match:', match);

if (match) {
  const idx = jet.indexOf(match[0]);
  console.log(jet.substring(idx, idx + 2500));
}

// Check methods of JetScene
const methods = jet.match(/([a-zA-Z0-9_]+)\s*\([^\)]*\)\s*\{/g);
console.log('Sample methods:', methods ? methods.slice(0, 30) : []);
