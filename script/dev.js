const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server')

const config = require('../webpack.config.js');
const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
    stats: {
        colors: true,
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Starting server on http://localhost:3000');
});
