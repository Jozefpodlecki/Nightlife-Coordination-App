const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env, argv) => {
    const mode = 'production';

    return merge(common(env, argv, mode), {
        mode
    });
}