const fs = require('fs');
const css = fs.readFileSync('original_assets/index-DRKrxnVA.css', 'utf8');

// Find all css var definitions (--name: value)
const matches = css.match(/--[a-zA-Z0-9_-]+:\s*[^;}]+/g) || [];
const vars = {};
for (const m of matches) {
  const [k, v] = m.split(':');
  if (k && v && !k.startsWith('--tw-')) {
    vars[k.trim()] = v.trim();
  }
}
console.log('Project CSS variables:', vars);
