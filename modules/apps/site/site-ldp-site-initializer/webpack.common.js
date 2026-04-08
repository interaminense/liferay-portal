/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const PUBLIC_PATH = '/o/site-ldp-site-initializer/dist/';

function resolveModule(name = '') {
	return path.resolve(__dirname, 'src', 'main', 'js', name);
}

const config = {
	entry: resolveModule('main.jsx'),
	module: {
		rules: [
			{
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
				},
				resolve: {
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
				test: /\.(js|ts)x?$/,
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
	output: {
		filename: 'main.js',
		path: path.resolve('src/main/resources/META-INF/resources/dist'),
		publicPath: PUBLIC_PATH,
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'main.css',
		}),
	],
	target: 'web',
};

module.exports = {config, publicPath: PUBLIC_PATH};
