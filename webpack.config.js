 var webpack = require('webpack');
 var path = require('path');

module.exports = {
    context: __dirname + '/', // `__dirname` is root of project and `src` is source

    entry: {
        substate: './src/parts/SubState.prod.js'
    },

    output: {
      path: path.join(__dirname),
      filename: 'index.js',
      library: ["SubState"],
      libraryTarget: "umd",
      libraryExport: "default"
    },

    resolve: {
        extensions: ['.js']
    },

    // maybe for later if writing in ES6>
    module: {
        rules: [{
            test: /\.js?$/, // Check for all js files
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: { presets: ['es2015'] }
            }]
        }]
    },


    plugins: [
        new webpack.optimize.UglifyJsPlugin({ //plugin that minifies js
            compress: { warnings: false }, //compression settings
            sourceMap: true //generate a source map for each minified file
        })
    ],


};