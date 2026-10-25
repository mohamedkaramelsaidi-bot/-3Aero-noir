const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const regex = /We\(["']([^"']+)["']\)/g;
let m;
const list = new Set();
while ((m = regex.exec(js)) !== null) {
  list.add(m[1]);
}
console.log('All We() args:', [...list]);

const vidRegex = /\/videos\/([a-zA-Z0-9_-]+)\.mp4/g;
const vids = new Set();
while ((m = vidRegex.exec(js)) !== null) {
  vids.add(m[1]);
}
console.log('Explicit video names:', [...vids]);

const posterRegex = /\/posters\/([a-zA-Z0-9_-]+)\.jpg/g;
const posters = new Set();
while ((m = posterRegex.exec(js)) !== null) {
  posters.add(m[1]);
}
console.log('Explicit poster names:', [...posters]);
