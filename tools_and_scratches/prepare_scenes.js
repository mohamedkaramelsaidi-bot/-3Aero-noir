const fs = require('fs');
const path = require('path');

const outDir = 'public/assets';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 1. Write index-scene-deps.js
const deps = `export const S = [
  { pos: [11.4, 1.3, 9], target: [.4, -.25, .2], fov: 38, shift: .04, lift: .12 },
  { pos: [.2, .1, 17.5], target: [.2, -.3, 0], fov: 34, shift: .02, lift: .08 },
  { pos: [8.6, 11.2, 10.4], target: [-.6, -.6, 0], fov: 36, shift: -.1, lift: .06 },
  { pos: [6.6, .5, 3.9], target: [2.8, -.35, 0], fov: 36, shift: .1, lift: .06 },
  { pos: [-6.2, 3.4, 7.4], target: [-2.2, -.3, .9], fov: 40, shift: .03, lift: .06 },
  { pos: [-15.5, 3.8, -8.6], target: [.4, -.4, 0], fov: 38, shift: .1, lift: .08 }
];

export const T = [
  { bulge: 3.5, lift: .6, spin: 1 },
  { bulge: 1.5, lift: 2, spin: -1 },
  { bulge: 1, lift: -.8, spin: -1 },
  { bulge: .8, lift: .6, spin: 1 },
  { bulge: 2.5, lift: 1.4, spin: 1 }
];
`;
fs.writeFileSync(path.join(outDir, 'index-scene-deps.js'), deps);

// 2. Copy and adapt jet-scene
let jetCode = fs.readFileSync('original_assets/assets/jet-scene-Dw6psgr-.js', 'utf8');
jetCode = jetCode.replace('./index-D9t9AB3n.js', './index-scene-deps.js');
fs.writeFileSync(path.join(outDir, 'jet-scene.js'), jetCode);

// 3. Copy GLTFLoader
fs.copyFileSync('original_assets/assets/GLTFLoader-BcfhmKiC.js', path.join(outDir, 'GLTFLoader-BcfhmKiC.js'));

// 4. Copy top-view-scene
fs.copyFileSync('original_assets/assets/top-view-scene-C1iUWJYf.js', path.join(outDir, 'top-view-scene.js'));

console.log('Prepared scene assets in public/assets!');
