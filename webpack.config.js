 var webpack = require('webpack');
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
 var path = require('path');

module.exports = [{
    context: __dirname + '/', // `__dirname` is root of project and `src` is source

    entry: {
        substate: './src/parts/SubState.js'
    },

    output: {
      path: path.join(__dirname),
      filename: 'index.dev.js',
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
                options: { presets: ['env','es2015','react'] }
            }]
        }]
    },


    // plugins: pluginForEnvironment(false),


},
{
    context: __dirname + '/', // `__dirname` is root of project and `src` is source

    entry: {
        substate: './src/parts/SubState.js'
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


    optimization: pluginForEnvironment(true),


}];


function pluginForEnvironment(bool){

    return({
        // minimizer: [
        //         { //plugin that minifies js
        //             // Eliminate comments
        //             comments: false,
        //             compress: {
        //                 warnings: false, //remove warnings
        //                 drop_console: bool //remove console.logs
        //             },
        //             sourceMap: true //generate a source map for each minified file
        //         }
        //     ]
        minimizer: [
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new UglifyJsPlugin({
              uglifyOptions: {
                compress: {
                    warnings: false,
                    drop_console: bool
                },
                comments: false
              },
              sourceMap: true
            })
          ]

    })

}