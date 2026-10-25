const fs = require('fs');
const css = fs.readFileSync('original_assets/index-DRKrxnVA.css', 'utf8');

// Find all classes that have a hyphen but aren't standard tailwind utility classes
const custom = css.match(/\.[a-z][a-z0-9_-]+\b/g) || [];
const unique = [...new Set(custom)].filter(c => 
  !c.startsWith('.text-') && !c.startsWith('.bg-') && !c.startsWith('.border-') &&
  !c.startsWith('.m-') && !c.startsWith('.p-') && !c.startsWith('.top-') &&
  !c.startsWith('.left-') && !c.startsWith('.right-') && !c.startsWith('.bottom-') &&
  !c.startsWith('.inset-') && !c.startsWith('.gap-') && !c.startsWith('.w-') &&
  !c.startsWith('.h-') && !c.startsWith('.max-') && !c.startsWith('.min-') &&
  !c.startsWith('.flex-') && !c.startsWith('.grid-') && !c.startsWith('.items-') &&
  !c.startsWith('.justify-') && !c.startsWith('.rounded-') && !c.startsWith('.opacity-') &&
  !c.startsWith('.transition-') && !c.startsWith('.duration-') && !c.startsWith('.ease-')
);

console.log('Custom CSS classes:');
console.log(unique);
