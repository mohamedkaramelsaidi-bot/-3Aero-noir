const fs = require('fs');
const path = require('path');

const files = [
  'original_assets/index-D9t9AB3n.js',
  'original_assets/index-DRKrxnVA.css',
  'original_assets/assets/jet-scene-Dw6psgr-.js',
  'original_assets/assets/GLTFLoader-BcfhmKiC.js',
  'original_assets/assets/top-view-scene-C1iUWJYf.js'
];

const found = new Set();
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  // Match "/something.ext" or "/dir/something.ext"
  const regex = /"(\/[a-zA-Z0-9_\-\.\/]+\.[a-zA-Z0-9]+)"|'(\/[a-zA-Z0-9_\-\.\/]+\.[a-zA-Z0-9]+)'|`(\/[a-zA-Z0-9_\-\.\/]+\.[a-zA-Z0-9]+)`/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const val = m[1] || m[2] || m[3];
    if (val && !val.endsWith('.js')) {
      found.add(val);
    }
  }
}

console.log('All referenced static assets:');
for (const f of found) {
  const local = path.join('public', f);
  console.log(`${f} -> ${fs.existsSync(local) ? 'EXISTS' : 'MISSING'}`);
}
