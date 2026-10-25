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
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', reject);
  });
}

async function main() {
  const baseUrl = 'https://aeronoi-hii8clf.runable.site';
  console.log('Downloading index.css...');
  await download(`${baseUrl}/assets/index-DRKrxnVA.css`, 'original_assets/index-DRKrxnVA.css');
  console.log('Downloading index.js...');
  await download(`${baseUrl}/assets/index-D9t9AB3n.js`, 'original_assets/index-D9t9AB3n.js');
  console.log('Downloading favicon...');
  try {
    await download(`${baseUrl}/favicon.ico`, 'original_assets/favicon.ico');
  } catch (e) {
    console.log('Favicon error:', e.message);
  }
  
  // Now analyze index.js for asset references: urls, audio, images, fonts, models
  const jsContent = fs.readFileSync('original_assets/index-D9t9AB3n.js', 'utf8');
  console.log('JS content length:', jsContent.length);

  // Look for any /assets/ or .mp3, .wav, .ogg, .png, .jpg, .svg, .glb, .gltf
  const assetRegex = /["'`]((\/assets\/[^"'`]+)|(https?:\/\/[^"'`]+\.(mp3|wav|ogg|png|jpg|jpeg|webp|svg|glb|gltf|hdr|bin)))["'`]/gi;
  const matches = new Set();
  let m;
  while ((m = assetRegex.exec(jsContent)) !== null) {
    matches.add(m[1]);
  }

  // Also check string literals matching .mp3, .wav, .ogg, .png, .jpg, .svg, etc.
  const fileRegex = /["'`]([^"'`\s]+\.(mp3|wav|ogg|png|jpg|jpeg|webp|svg|glb|gltf|hdr|bin))["'`]/gi;
  while ((m = fileRegex.exec(jsContent)) !== null) {
    matches.add(m[1]);
  }

  console.log('Found potential assets in JS:');
  for (const asset of matches) {
    console.log(' - ' + asset);
  }

  // Also inspect CSS for url(...)
  const cssContent = fs.readFileSync('original_assets/index-DRKrxnVA.css', 'utf8');
  const cssUrlRegex = /url\(['"]?([^'")]+)['"]?\)/gi;
  while ((m = cssUrlRegex.exec(cssContent)) !== null) {
    console.log(' - CSS url:', m[1]);
  }
}

main().catch(console.error);
