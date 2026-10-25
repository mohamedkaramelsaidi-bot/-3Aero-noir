const fs = require('fs');

const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

// Find all strings containing '/' or '.'
const matches = js.match(/"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'|`([^`\\]*(\\.[^`\\]*)*)`/g) || [];

const interesting = new Set();
for (const str of matches) {
  const clean = str.slice(1, -1);
  if (clean.includes('.mp3') || clean.includes('.wav') || clean.includes('.ogg') ||
      clean.includes('.jpg') || clean.includes('.png') || clean.includes('.webp') ||
      clean.includes('.svg') || clean.includes('.glb') || clean.includes('.gltf') ||
      clean.includes('/audio') || clean.includes('/images') || clean.includes('/posters') ||
      clean.includes('fonts.googleapis') || clean.includes('data:image')) {
    interesting.add(clean);
  }
}

console.log('Interesting asset strings:');
interesting.forEach(item => console.log(item));
