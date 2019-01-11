import * as webpack from 'webpack';

const config: webpack.Configuration = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    library: 'pixi-scenegraph',
    libraryTarget: 'umd',
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  mode: 'development', //'production',
  devtool: 'source-map',
  externals: [
    // Don't bundle pixi.js and filters.
    { 'pixi.js': 'PIXI' },
    { '@pixi/filter-outline': 'PIXI.filters' },
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
