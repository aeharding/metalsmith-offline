let cheerio = require('cheerio'),
  fs = require('fs'),
  path = require('path'),
  swPrecache = require('sw-precache');


module.exports = () => {
  return function offline(files, metalsmith, done) {
    for (let fileName in files) {
      if (isHTML(fileName)) {
        const $ = cheerio.load(files[fileName].contents);

        $('body').append('<script src="service-worker-registration.js"></script>');
        files[fileName].contents = new Buffer($.html());
      }
    }

    const serviceWorkerRegistration = fs.readFileSync(path.join(__dirname, 'service-worker-registration.js'));

    files['service-worker-registration.js'] = {
      contents: new Buffer(serviceWorkerRegistration)
    };

    swPrecache.generate({
      staticFileGlobs: Object.keys(files),
      fileGetter: fileName => files[fileName].contents
    })
    .then(contents => {
      files['service-worker.js'] = {
        contents: new Buffer(contents)
      };

      done();
    })
    .catch(e => {
      done(e);
    });
  };
}

function isHTML(fileName) {
  return fileName.slice(-5) === '.html';
}