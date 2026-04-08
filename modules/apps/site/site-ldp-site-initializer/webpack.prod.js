/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const common = require('./webpack.common');
const {merge} = require('webpack-merge');

module.exports = merge(common.config, {
	mode: 'production',
	output: {
		chunkFilename: '[id].[chunkhash].js',
	},
	performance: {
		hints: false,
	},
});
