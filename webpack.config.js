const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const CleanCSS = require('clean-css');

module.exports = {
    entry: './src/scripts/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/graph-xperience/"
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/*.html', to: '[name][ext]' },
                { from: 'src/assets/*', to: 'assets/[name][ext]' },
                {
                    from: 'src/styles/*',
                    to: 'styles/[name][ext]',
                    transform: content => (new CleanCSS({ level: 2 }).minify(content)).styles
                }
            ]
        })
    ]
}