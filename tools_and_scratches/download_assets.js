const fs = require('fs');
const path = require('path');
const https = require('https');

function download(url, dest) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        console.log(`Failed ${url}: status ${res.statusCode}`);
        return resolve(false);
      }
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded ${url} -> ${dest}`);
          resolve(true);
        });
      });
    }).on('error', (err) => {
      console.log(`Error ${url}: ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  const base = 'https://aeronoi-hii8clf.runable.site';
  
  const audios = [
    '/audio/hover.mp3',
    '/audio/transition.mp3',
    '/audio/ambient.mp3',
    '/audio/engine.mp3',
    '/audio/whoosh.mp3'
  ];
  for (const a of audios) {
    await download(base + a, 'public' + a);
  }

  const images = [
    '/images/clouds.webp',
    '/images/clouds-m.webp',
    '/posters/charter.jpg',
    '/favicon.ico'
  ];
  for (const img of images) {
    await download(base + img, 'public' + img);
  }

  // Also check numbered posters, e.g. 0.jpg, 1.jpg, 2.jpg, ...
  for (let i = 0; i <= 20; i++) {
    await download(`${base}/posters/${i}.jpg`, `public/posters/${i}.jpg`);
  }

  // Also check other named posters
  const namedPosters = ['hero', 'overview', 'specs', 'interior', 'cockpit', 'journey', 'contact', 'exterior', 'plane', 'jet'];
  for (const name of namedPosters) {
    await download(`${base}/posters/${name}.jpg`, `public/posters/${name}.jpg`);
  }
}

main();
