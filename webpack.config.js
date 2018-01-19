 var webpack = require('webpack');
 var path = require('path');

// module.exports = {
//     context: __dirname + '/', // `__dirname` is root of project and `src` is source
//
//     entry: {
//         app: './public/index.js',
//         bull: './public/appData/appData.js',
//         reactExample: './public/react-example/index.js'
//     },
//
//     output: {
//         path: __dirname + '/dist', // `dist` is the destination
//         filename: '[name].bundle.js'
//     },
//
//     //To run development server
//     devServer: {
//         contentBase: __dirname + '/public',
//     },
//      resolve: {
//         extensions: ['.js', '.jsx']
//     },
//
//     module: {
//         rules: [{
//             test: /\.jsx?$/, // Check for all js files
//             exclude: /node_modules/,
//             use: [{
//                 loader: 'babel-loader',
//                 options: { presets: ['es2015', 'react'] }
//             }]
//         }]
//     },
//
//
//     // plugins: [
//     //     new webpack.optimize.UglifyJsPlugin({ //plugin that minifies js
//     //         compress: { warnings: false }, //compression settings
//     //         sourceMap: true //generate a source map for each minified file
//     //     })
//     //     //,new ExtractTextPlugin("[name]-styles.css")             //plugin that extracts css.  Takes one argument of an output name (which references keys in [entry] object)... to minify css use optimize-css-assets-webpack-plugin
//     // ],
//
//     devtool: "source-map" // Default development sourcemap
// };



//var webpack = require('webpack');
//var path = require('path');
//
module.exports = {
    context: __dirname + '/', // `__dirname` is root of project and `src` is source

    entry: {
        substate: './src/parts/SubState.prod.js'
    },

    output: {
        path: path.join(__dirname, '/libDist'),
        filename: 'index.js',
        library: 'SubState',
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