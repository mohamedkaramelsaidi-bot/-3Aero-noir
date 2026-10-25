const fs = require('fs');
const css = fs.readFileSync('original_assets/index-DRKrxnVA.css', 'utf8');

console.log('CSS length:', css.length);

// Extract root CSS variables
const rootMatch = css.match(/:root\s*\{[^}]+\}/g);
if (rootMatch) {
  console.log('Root vars:');
  console.log(rootMatch[0]);
}

// Extract any keyframes
const keyframes = css.match(/@keyframes\s+[\w-]+\s*\{[^}]+\}/g);
if (keyframes) {
  console.log('Keyframes:');
  keyframes.slice(0, 10).forEach(k => console.log(k.slice(0, 80)));
}
