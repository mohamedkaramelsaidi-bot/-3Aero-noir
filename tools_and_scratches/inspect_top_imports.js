const fs = require('fs');
const top = fs.readFileSync('original_assets/assets/top-view-scene-C1iUWJYf.js', 'utf8');

const imports = top.match(/import[^;]+;/g);
console.log('Top view imports:', imports);
