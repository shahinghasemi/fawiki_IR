const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundled.js',
        path: path.resolve(__dirname, 'src/dist')
    },
    mode: 'development',
    devServer: {
        contentBase: path.resolve(__dirname, 'src'),
        hot: true,
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
        ]
    },
    plugins: [ new HtmlWebpackPlugin()]
}