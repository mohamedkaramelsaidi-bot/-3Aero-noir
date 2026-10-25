const https = require('https');

function checkMap(url) {
  https.get(url, (res) => {
    console.log(`${url} -> status ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('Source map exists! Content length:', res.headers['content-length']);
    }
  });
}

checkMap('https://aeronoi-hii8clf.runable.site/assets/index-D9t9AB3n.js.map');
checkMap('https://aeronoi-hii8clf.runable.site/assets/jet-scene-Dw6psgr-.js.map');
checkMap('https://aeronoi-hii8clf.runable.site/assets/top-view-scene-C1iUWJYf.js.map');
checkMap('https://aeronoi-hii8clf.runable.site/assets/index-DRKrxnVA.css.map');
