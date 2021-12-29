const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { readFileSync, rmdirSync } = require('fs');

const DEFAULT_FEDERATED_CONFIG = {
  name: 'remoteApp',
  library: { type: 'var', name: 'remoteApp' },
  filename: 'remote.[contenthash].js',
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
};

const createFederatedConfig = (exposes) => {
  return Object.assign(DEFAULT_FEDERATED_CONFIG, { exposes });
};

const applyDefaults = (webpackOpts) => {
  const defaults = {
    mode: 'production',
    optimization: {
      chunkIds: 'deterministic',
      splitChunks: {
        chunks: 'async',
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        maxSize: 24400,
        minSize: 20000,
        chunks: 'all',
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      ],
    },
    output: {
      publicPath: '',
      filename: '[name].[contenthash].js',
    },
  };
  return merge(defaults, webpackOpts);
};

const prepare = (webpackOpts) => {
  if (Array.isArray(webpackOpts)) {
    return webpackOpts.map((opts) => applyDefaults(opts));
  }
  return applyDefaults(webpackOpts);
};

const compile = (config, compilerOps) => {
  const compiler = webpack(prepare(config));

  Object.assign(compiler, compilerOps);

  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (stats.hasErrors()) {
        console.log(stats.toJson());
      }

      resolve(stats);
    });
  });
};

const readJson = (path) => {
  const content = readFileSync(path, 'utf-8');
  return JSON.parse(content);
};

const deleteDir = (directory) => {
  try {
    rmdirSync(directory, { recursive: true });
  } catch (err) {
    console.error(`Error while deleting ${directory}.`);
  }
};

module.exports = { readJson, compile, createFederatedConfig, deleteDir };
