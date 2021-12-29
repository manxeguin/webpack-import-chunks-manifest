const { readJson, compile, deleteDir } = require('./utils');
const path = require('path');
const ImportChunksManifestPlugin = require('../src/index');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const OUTPUT_DIR = path.resolve(__dirname, '../dist');

afterEach(() => {
  deleteDir(OUTPUT_DIR);
});

describe('regular app', () => {
  test('manifest contains only entries with webpackChunkName', async () => {
    const config = {
      entry: path.resolve(__dirname, './__mocks__/app2/index.js'),
      plugins: [new ImportChunksManifestPlugin({})],
    };

    await compile(config, {});
    const manifest = readJson(
      path.resolve(__dirname, '../dist/importChunks.json')
    );
    expect(manifest.imports.moduleB).toBeDefined();
    expect(manifest.imports.moduleA).toBeUndefined();
  });
});
