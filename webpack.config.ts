import * as webpack from 'webpack';

const config: webpack.Configuration = {
      
    entry: {
        index:   "./index.ts",
    },


    resolve: {
        extensions: [".ts", ".js"]
    },

    mode: 'development',//'production',
    devtool: false,
    externals: [
        // Don't bundle pixi.js and filters.
        {"pixi.js": "PIXI"},
        {"@pixi/filter-outline": "PIXI.filters"}
    ],

    module: {
        rules: [
            { test: /\.js$/, loader: "source-map-loader", enforce: 'pre' },
            { test: /\.ts$/, loader: "ts-loader" },
        ],
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
    }
};

module.exports = config;