link-require
============

Expose your source folder globally within your project.

This works by essentially creating a symlink of the
source directory you wish to expose under `node_modules`.

Why
---

Because `require('../../../../../../../../../')` has to go.

Usage
-----

### Installation

```shell
npm install --save link-require
```

### Setup

In your package.json:

```json
{
  "scripts": {
    "postinstall": "link-require ./src:app"
   }
}
```

You can specify multiple mapping as well:

```json
{
  "scripts": {
    "postinstall": "link-require ./src:src ./lib:lib"
   }
}
```

### When requiring

```javascript
const mySource = require('app/mySource')
```
