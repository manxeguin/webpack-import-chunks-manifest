const { writeFileSync, mkdirSync } = require('fs');
const path = require('path');

const PLUGIN_NAME = 'ImportChunksManifestPlugin';
const DEFAULT_OUTPUT_FILE = 'importChunks.json';

class ImportChunksManifestPlugin {
  constructor(opts) {
    this.options = Object.assign({}, opts);
  }
  apply(compiler) {
    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
      const compilation = stats.compilation;
      const chunksMap = {};

      Object.keys(stats.compilation.chunkGroups).forEach((key) => {
        const chunkGroupName = stats.compilation.chunkGroups[key].options.name;

        if (chunkGroupName) {
          const chunkGroupFiles = [];
          Object.keys(stats.compilation.chunkGroups[key].chunks).forEach(
            (chunkKey) => {
              const chunk = stats.compilation.chunkGroups[key].chunks[chunkKey];
              chunkGroupFiles.push(
                ...chunk.files.filter((file) => file.endsWith('js'))
              );
            }
          );

          chunksMap[chunkGroupName] = chunkGroupFiles;
        }
      });

      const entrypointsArray = Array.from(compilation.entrypoints.entries());
      const entrypoints = entrypointsArray.reduce(
        (e, [name, entrypoint]) =>
          Object.assign(e, {
            [name]: entrypoint.getFiles().filter((file) => file.endsWith('js')),
          }),
        {}
      );

      const result = {
        entrypoints,
        imports: chunksMap,
      };

      const publicPath = this.options.path
        ? path.join(stats.compilation.outputOptions.path, this.options.path)
        : path.join(stats.compilation.outputOptions.path, DEFAULT_OUTPUT_FILE);

      if (publicPath) {
        const dirName = path.dirname(publicPath);
        mkdirSync(dirName, { recursive: true });
        writeFileSync(publicPath, JSON.stringify(result) + '\r\n');
      }
    });
  }
}

module.exports = ImportChunksManifestPlugin;
