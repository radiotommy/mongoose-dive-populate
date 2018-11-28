
var webpack = require('webpack')
var path = require('path')
var libraryName = 'mongoose-dive-populate'
var outputFile = libraryName + '.js'

var config = {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['js']
    }
}

module.exports = config
