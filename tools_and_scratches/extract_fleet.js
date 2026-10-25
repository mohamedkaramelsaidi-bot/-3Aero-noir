const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

// Let's print out 2000 characters starting from idx 357500
console.log(js.substring(357500, 362000));
