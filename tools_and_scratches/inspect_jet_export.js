const fs = require('fs');
const jet = fs.readFileSync('original_assets/assets/jet-scene-Dw6psgr-.js', 'utf8');
console.log('Exports in jet-scene:', jet.substring(jet.lastIndexOf('export')));
