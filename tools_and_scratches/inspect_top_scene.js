const fs = require('fs');

const top = fs.readFileSync('original_assets/assets/top-view-scene-C1iUWJYf.js', 'utf8');

// Find constructor and methods
const methods = top.match(/([a-zA-Z0-9_]+)\s*\([^\)]*\)\s*\{/g);
console.log('TopViewScene methods:', methods ? methods.slice(0, 30) : []);
console.log('Exports in top-view-scene:', top.substring(top.lastIndexOf('export')));
