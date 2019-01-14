import * as webpack from 'webpack';

const config: webpack.Configuration = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    library: 'pixi-scenegraph',
    libraryTarget: 'commonjs2',
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  mode: 'production',
  //devtool: 'source-map',
  externals: [
    // Don't bundle pixi.js and filters.
    {
      'pixi.js': {
        root: 'PIXI',
        commonjs2: 'pixi.js',
        commonjs: 'pixi.js',
      },
    },
    {
      '@pixi/filter-outline': {
        root: 'PIXI.filters',
        commonjs2: '@pixi/filter-outline',
        commonjs: '@pixi/filter-outline',
      },
    },
  ],

  module: {
    rules: [{ test: /\.js$/, loader: 'source-map-loader', enforce: 'pre' }, { test: /\.ts$/, loader: 'ts-loader' }],
  },

  optimization: {
    runtimeChunk: false,
    splitChunks: false,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    flagIncludedChunks: true,
    providedExports: true,
    usedExports: true,
  },
};

module.exports = config;