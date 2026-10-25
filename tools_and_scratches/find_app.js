const fs = require('fs');

const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

// Find where the App component or root rendering is
const renderIdx = js.lastIndexOf('createRoot');
console.log('createRoot at:', renderIdx);
if (renderIdx !== -1) {
  console.log(js.substring(renderIdx - 1000, renderIdx + 500));
}
