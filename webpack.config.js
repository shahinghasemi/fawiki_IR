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
        open: true,
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
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] }, //order matters in use!
        ]
    },
    plugins: [ new HtmlWebpackPlugin({title: "Search Engine"})]
}