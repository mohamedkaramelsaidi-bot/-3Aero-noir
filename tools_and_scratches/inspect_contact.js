const fs = require('fs');
const contact = fs.readFileSync('decompiled/contact_component.js', 'utf8');

console.log('Contact code:');
console.log(contact.substring(0, 3000));
