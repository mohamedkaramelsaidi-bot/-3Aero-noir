const fs = require('fs');
const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

const components = ['xD', 'WE', 'EC', 'AC', 'OC', 'vD', 'bD', 'cv', 'en'];

components.forEach(name => {
  const funcStr = `function ${name}(`;
  let idx = js.indexOf(funcStr);
  if (idx === -1) {
    const varStr = `const ${name}=`;
    idx = js.indexOf(varStr);
  }
  if (idx !== -1) {
    console.log(`=== FOUND ${name} at ${idx} ===`);
    console.log(js.substring(idx, Math.min(js.length, idx + 1500)));
  } else {
    console.log(`Could not find ${name}`);
  }
});
