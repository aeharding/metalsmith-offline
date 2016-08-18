let cheerio = require('cheerio'),
  fs = require('fs'),
  path = require('path');


module.exports = () => {
  return function offline(files, metalsmith, done) {
    for (let fileName in files) {
      if (isHTML(fileName)) {
        const $ = cheerio.load(files[fileName].contents);
        console.log(fileName)
        $('html').attr('manifest', path.relative(fileName, 'manifest.appcache').slice(3));

        files[fileName].contents = new Buffer($.html());
      }
    }

    files['manifest.appcache'] = {
      contents: createCacheManifest(Object.keys(files))
    };

    done();
  };
}

function isHTML(fileName) {
  return fileName.slice(-5) === '.html';
}

function createCacheManifest(files) {
  // semantic pages examples:
  // 'index.html' => '/'
  // 'blog/index.html' => '/blog/'
  const semanticPages = [];

  files.forEach(fileName => {
    if (fileName.slice(-10) === 'index.html') {
      const url = fileName.substr(0, fileName.length - 10)
      semanticPages.push(`/${url} ${fileName}`);

      if (fileName !== 'index.html') {
        semanticPages.push(`/${url.substr(0, url.length - 1)} ${fileName}`);
      }
    }
  });

  return `CACHE MANIFEST
# rev ${new Date()}

CACHE:
${files.join('\n')}

FALLBACK:
# ('semantic' pages)
${semanticPages.join('\n')}

NETWORK:
*
http://*
https://*`;
}