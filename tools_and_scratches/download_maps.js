const fs = require('fs');
const path = require('path');
const https = require('https');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${url}: status ${res.statusCode}`));
      }
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded ${url} -> ${dest}`);
          resolve();
        });
      });
    }).on('error', reject);
  });
}

async function main() {
  const base = 'https://aeronoi-hii8clf.runable.site';
  const maps = [
    '/assets/index-D9t9AB3n.js.map',
    '/assets/jet-scene-Dw6psgr-.js.map',
    '/assets/top-view-scene-C1iUWJYf.js.map',
    '/assets/index-DRKrxnVA.css.map'
  ];
  for (const m of maps) {
    await download(`${base}${m}`, `sourcemaps${m}`);
  }
  console.log('Downloaded all source maps!');
}

main().catch(console.error);
