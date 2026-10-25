const fs = require('fs');

const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

// Check what icons or external libraries are included
const libs = [];
if (js.includes('framer-motion')) libs.push('framer-motion');
if (js.includes('lucide')) libs.push('lucide-react');
if (js.includes('three')) libs.push('three');
if (js.includes('lenis')) libs.push('lenis');
if (js.includes('gsap')) libs.push('gsap');
if (js.includes('tailwind')) libs.push('tailwind');
console.log('Detected libs:', libs);

// Let's search for form inputs, state, modals
const formMatches = js.match(/["'](Departure|Arrival|Passenger|Email|Phone|Date|Charter|Request|Quote|Inquire)[^"']*["']/gi);
console.log('Form keywords:', [...new Set(formMatches || [])]);

// Check main app component and routes
console.log('Length of JS:', js.length);
