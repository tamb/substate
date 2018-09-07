 var webpack = require('webpack');
 var path = require('path');

module.exports = {
    context: __dirname + '/', // `__dirname` is root of project and `src` is source

    entry: {
        main: './index.js'
    },

    resolve: {
        extensions: ['.js']
    },
    // devServer: {
    //     contentBase: './dist',
    //  hot: true
    // },
    module: {
        rules: [{
            test: /\.js?$/, // Check for all js files
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: { presets: ['env','es2015','react'] }
            }]
        }]
    }//,
    // plugins: [
    //     new webpack.HotModuleReplacementPlugin()
    // ]
        
    
}