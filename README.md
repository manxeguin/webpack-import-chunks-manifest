# webpack-import-chunks-manifest

## Motivation

When we have independent javascript applications (like module federated apps) its difficult to know exactly what are the JS chunks that belongs to concrete parts of that application, especially dynamic imported chunks.

With this plugin we can create a json file mapping that imports with its specific javascript chunks, which will allow us to:

- *Preload/Prefetch* from different apps (like host or other remote app in Module federation)
- In consecuence of the previous: *avoid sequential downloading* of independent apps. Ex: *Host --> remoteApp --> dynamic import* part of remote app could be parallel with preloading/prefetching
## Install

Using npm:

```console
npm install webpack-import-chunks-manifest --save-dev
```

## Usage

Create a `webpack.config.js` file:

```js
const ImportChunksManifestPlugin = require('webpack-import-chunks-manifest');
const options = { ... };

module.exports = {
	entry: [ 'index.js'	],
  ...
  plugins: [
    new ImportChunksManifestPlugin()
  ]
};
```

the example above will create a `importChunks.json` file in the output directory for the build. The manifest file will contain a map of source webpackChunkNames to the corresponding build output files. e.g.

Having a dynamic import with webpackChunkName in the source code like:

```js
import(/* webpackChunkName: "moduleB" */ `./moduleB`).then((module) => {
  console.log({ module });
});
```
It will create a manifest with the entry in the "imports" section with the corresponding chunks

```json
{
  "entrypoints": { "main": ["main.7a3e764bdc69bccaf15a.js"] },
  "imports": {
    "main": ["main.7a3e764bdc69bccaf15a.js"],
    "moduleB": ["moduleB.7a3a172b0b71d0c4c5b9.js"]
  }
}
```

### Options (WIP)
