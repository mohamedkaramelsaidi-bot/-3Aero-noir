import fs from 'fs';
import path from 'path';

const srcDir = 'src';
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

// Copy original css to src/index.css
fs.copyFileSync('original_assets/index-DRKrxnVA.css', 'src/index.css');

console.log('Copied original CSS to src/index.css!');
