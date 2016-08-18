# metalsmith-offline

A metalsmith plugin to make your metalsmith website work offline.

Uses application cache manifest.

PRs welcome to get this to use a hybrid of service workers falling back to application cache.

 > **Warning:** To prevent bugs, try to add this as the last plugin in your metalsmith pipeline.

## Installation

```
npm install --save metalsmith-offline
```
## CLI Usage

```
{
  "plugins": {
    "metalsmith-offline": {
      "trailingSlash": false
    }
  }
}
```

## Javascript API

```javascript
var offline = require('metalsmith-offline');
 
metalsmith.use(offline({
  trailingSlash: false
}));
```

## Options

### `trailingSlash`

False by default.

If true, offline-enabled URLs will have trailing slashes

In example:

`/blog/` would be valid, but `/blog` would not be.