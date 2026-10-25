const fs = require('fs');
const css = fs.readFileSync('original_assets/index-DRKrxnVA.css', 'utf8');

// Find classes defined in the CSS
const classes = new Set();
const regex = /\.([a-zA-Z0-9_\-]+)\s*\{/g;
let m;
while ((m = regex.exec(css)) !== null) {
  if (!m[1].includes('\\') && !m[1].startsWith('-')) {
    classes.add(m[1]);
  }
}
console.log('Classes:', [...classes].filter(c => !c.startsWith('text-') && !c.startsWith('bg-') && !c.startsWith('p-') && !c.startsWith('m-')));
