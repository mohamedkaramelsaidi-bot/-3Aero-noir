const fs = require('fs');

const js = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');

// Let's find out what libraries are used: Three.js? GSAP? Lucide? Framer-motion? Tailwind?
console.log('Includes three:', js.includes('WebGLRenderer') || js.includes('THREE') || js.includes('PerspectiveCamera'));
console.log('Includes framer-motion:', js.includes('framer-motion') || js.includes('motion.div'));
console.log('Includes lucide:', js.includes('lucide'));
console.log('Includes canvas:', js.includes('<canvas') || js.includes('createElement("canvas")'));
console.log('Includes audio context:', js.includes('AudioContext'));

// Let's search for poster template literals or array definitions
const posterMatches = js.match(/posters\/[^"'`]+/g);
console.log('Poster matches in JS:', posterMatches);

// Let's check sections or chapters
const chapterMatches = js.match(/"(chapter|section|slide|step)[\w-]*"/gi);
console.log('Chapter/section matches:', [...new Set(chapterMatches || [])].slice(0, 30));
