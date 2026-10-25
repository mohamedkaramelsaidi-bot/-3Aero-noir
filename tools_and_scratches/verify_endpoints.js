import http from 'http';

const urls = [
  'http://localhost:4173/assets/jet-scene.js',
  'http://localhost:4173/assets/top-view-scene.js',
  'http://localhost:4173/assets/GLTFLoader-BcfhmKiC.js',
  'http://localhost:4173/assets/index-scene-deps.js',
  'http://localhost:4173/audio/hover.mp3',
  'http://localhost:4173/audio/whoosh.mp3',
  'http://localhost:4173/audio/ambient.mp3',
  'http://localhost:4173/models/jet.glb',
  'http://localhost:4173/textures/cloud-atlas.webp',
  'http://localhost:4173/videos/obsidian.mp4',
  'http://localhost:4173/videos/charter.mp4',
  'http://localhost:4173/posters/obsidian.jpg'
];

async function check(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      console.log(`${url.replace('http://localhost:4173', '')} -> Status: ${res.statusCode}, Content-Length: ${res.headers['content-length']}`);
      resolve(res.statusCode === 200);
    }).on('error', (err) => {
      console.error(`Error on ${url}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  for (const u of urls) {
    await check(u);
  }
}

run();
