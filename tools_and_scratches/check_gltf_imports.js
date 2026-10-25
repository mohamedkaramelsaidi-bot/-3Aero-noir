import fs from 'fs';
const c = fs.readFileSync('public/assets/GLTFLoader-BcfhmKiC.js', 'utf8');
console.log('Imports in GLTFLoader:', c.match(/import[^;]+;/g));
