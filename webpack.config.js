const fs = require('fs');
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
                    from: 'src/styles/**',
                    to: 'bundle.css',
                    transformAll(assets) {
                        const fileNames = assets.map(asset => asset.sourceFilename);
                        fileNames.forEach((fileName, i) => {
                            if (fileName.includes("reset")) {
                                fileNames.splice(i, 1);
                                fileNames.unshift(fileName);
                            }
                        });

                        return new CleanCSS({ level: 2 }).minify(fileNames).styles;
                    }
                }
            ]
        })
    ]
}