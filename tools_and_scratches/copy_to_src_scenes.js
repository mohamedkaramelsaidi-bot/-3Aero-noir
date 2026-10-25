import fs from 'fs';
import path from 'path';

const targetDir = 'src/scenes';
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const files = [
  'jet-scene.js',
  'top-view-scene.js',
  'GLTFLoader-BcfhmKiC.js',
  'index-scene-deps.js'
];

for (const f of files) {
  fs.copyFileSync(path.join('public/assets', f), path.join(targetDir, f));
  console.log(`Copied public/assets/${f} -> src/scenes/${f}`);
}
