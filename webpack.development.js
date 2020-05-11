const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env, argv) => {
    const mode = 'development';

    return merge(common(env, argv, mode), {
        mode,
        devtool: 'source-map',
        devServer: {  
            contentBase: './',  
            overlay: true
        }, 
    });
}