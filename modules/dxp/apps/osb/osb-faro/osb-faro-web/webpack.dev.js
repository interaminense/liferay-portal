const {createOnProxyRes} = require('./webpack.dev.proxy');
const {merge} = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
const webpack = require('webpack');

require('dotenv').config();

const TARGET = (process.env.FARO_URL || 'http://0.0.0.0:8080').replace(
	/\/$/,
	''
);

module.exports = merge(common.config, {
	devServer: {
		client: {
			overlay: false
		},
		host: '0.0.0.0',
		port: 3000,
		proxy: {
			'**': {
				changeOrigin: true,
				onProxyRes: createOnProxyRes(TARGET),
				selfHandleResponse: true,
				target: TARGET
			}
		}
	},
	devtool: 'eval-source-map',
	mode: 'development',
	module: {
		rules: [
			{
				include: common.include,
				loader: path.resolve(__dirname, 'scripts/lang-loader.js'),
				options: {
					path: path.resolve(
						__dirname,
						'../../../../../apps/portal-language/portal-language-lang/src/main/resources/content/Language.properties'
					)
				},
				test: /\.(js|ts)x?$/
			}
		]
	},
	output: {
		chunkFilename: '[name].[chunkhash:8].js',
		publicPath: common.PUBLIC_PATH
	},
	plugins: [
		new webpack.DefinePlugin({
			FARO_DEV_MODE: true
		})
	]
});
