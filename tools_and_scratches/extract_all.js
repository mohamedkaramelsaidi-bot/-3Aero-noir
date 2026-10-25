const fs = require('fs');
const path = require('path');

const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

// Function to find code between two markers or offsets
function saveSlice(name, startStr, endStr) {
  const startIdx = js.indexOf(startStr);
  if (startIdx === -1) {
    console.log(`Could not find start for ${name}: ${startStr}`);
    return;
  }
  let endIdx = js.indexOf(endStr, startIdx + startStr.length);
  if (endIdx === -1) {
    endIdx = startIdx + 3000;
  }
  const slice = js.substring(startIdx, endIdx);
  const outDir = 'decompiled';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${name}.js`), slice, 'utf8');
  console.log(`Saved ${name}: ${slice.length} chars`);
}

// 1. Audio engine
saveSlice('audio_engine', 'class QE{', 'function Rl(){');

// 2. Gesture navigation controller
saveSlice('gesture_controller', 'class YE{', 'function Rl(){');

// 3. Hero component
saveSlice('hero_component', 'function WE(){', 'function EC(){');

// 4. Fleet component
saveSlice('fleet_component', 'function EC(){', 'function AC(){');

// 5. Charter component
saveSlice('charter_component', 'function AC(){', 'function OC(){');

// 6. Ownership component
saveSlice('ownership_component', 'function OC(){', 'function vD(){');

// 7. Contact component
saveSlice('contact_component', 'function vD(){', 'function bD(){');

// 8. Footer component
saveSlice('footer_component', 'function bD(){', 'function xD(){');

// 9. Header component
saveSlice('header_component', 'function xD(){', 'function SD(){');

// 10. Root page & state
saveSlice('root_page', 'function SD(){', 'pE.createRoot');
