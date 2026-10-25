const fs = require('fs');
const charter = fs.readFileSync('decompiled/charter_component.js', 'utf8');

console.log('Charter code:');
console.log(charter.substring(0, 3000));
