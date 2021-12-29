const { ModuleFederationPlugin } = require('webpack').container;
const {
  readJson,
  compile,
  createFederatedConfig,
  deleteDir,
} = require('./utils');
const path = require('path');
const ImportChunksManifestPlugin = require('../src/index');
const OUTPUT_DIR = path.resolve(__dirname, '../dist');

afterEach(() => {
  deleteDir(OUTPUT_DIR);
});

describe('Federated module', () => {
  test('manifest contains remote and imports with webpackChunkName', async () => {
    const config = {
      entry: path.resolve(__dirname, './__mocks__/app1/index.js'),
      plugins: [
        new ModuleFederationPlugin(
          createFederatedConfig({
            './Button': path.resolve(__dirname, './__mocks__/app1/Button'),
          })
        ),
        new ImportChunksManifestPlugin({}),
      ],
    };

    await compile(config, {});
    const manifest = readJson(
      path.resolve(__dirname, '../dist/importChunks.json')
    );

    expect(manifest.imports.moduleB).toBeDefined();
    expect(manifest.imports.moduleC).toBeDefined();
  });
});
