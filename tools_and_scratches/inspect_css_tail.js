const fs = require('fs');
const css = fs.readFileSync('original_assets/index-DRKrxnVA.css', 'utf8');

// Print the last 6000 characters of CSS
console.log(css.substring(Math.max(0, css.length - 6000)));
