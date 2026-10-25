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
  const assets = [
    '/textures/cloud-atlas.webp',
    '/textures/cloud-atlas-m.webp',
    '/models/jet.glb'
  ];
  for (const a of assets) {
    await download(`${base}${a}`, `public${a}`);
  }
}

main();
