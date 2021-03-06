let cheerio = require('cheerio'),
  fs = require('fs'),
  path = require('path');


module.exports = options => {
  return function offline(files, metalsmith, done) {
    for (let fileName in files) {
      if (isHTML(fileName)) {
        const $ = cheerio.load(files[fileName].contents);

        $('html').attr('manifest', path.relative(fileName, 'manifest.appcache').slice(3));

        files[fileName].contents = new Buffer($.html());
      }
    }

    files['manifest.appcache'] = {
      contents: createCacheManifest(Object.keys(files), options.trailingSlash)
    };

    done();
  };
}

function isHTML(fileName) {
  return fileName.slice(-5) === '.html';
}

function createCacheManifest(files, trailingSlash) {
  // semantic pages examples:
  // 'index.html' => '/'
  // 'blog/index.html' => '/blog/'

  files = files.map(fileName => {
    if (fileName.slice(-10) === 'index.html') {
      const url = fileName.substr(0, fileName.length - (trailingSlash ? 10 : 11));

      return `/${url}`;
    }

    return fileName;
  });

  return `CACHE MANIFEST
# rev ${new Date()}

CACHE:
${files.join('\n')}

NETWORK:
*
http://*
https://*`;
}