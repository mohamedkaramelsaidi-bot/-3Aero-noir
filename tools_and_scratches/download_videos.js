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
  const names = ['obsidian', 'pearl', 'silver', 'navy', 'bronze', 'cabin', 'detail'];
  for (const n of names) {
    await download(`${base}/videos/${n}.mp4`, `public/videos/${n}.mp4`);
    await download(`${base}/posters/${n}.jpg`, `public/posters/${n}.jpg`);
  }
  await download(`${base}/videos/charter.mp4`, `public/videos/charter.mp4`);
  await download(`${base}/videos/charter-m.mp4`, `public/videos/charter-m.mp4`);
  await download(`${base}/posters/charter.jpg`, `public/posters/charter.jpg`);
  console.log('All downloads done!');
}

main();
