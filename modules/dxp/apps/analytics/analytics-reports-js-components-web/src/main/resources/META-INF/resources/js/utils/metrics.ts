/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {AssetTypes, MetricName, MetricType} from '../types/global';

type AssetMetrics = {
	[key in AssetTypes]: MetricName[];
};

export const assetMetrics: AssetMetrics = {
	[AssetTypes.Blog]: [MetricName.Views, MetricName.Comments],
	[AssetTypes.Document]: [
		MetricName.Downloads,
		MetricName.Previews,
		MetricName.Comments,
	],
	[AssetTypes.WebContent]: [MetricName.Views],
	[AssetTypes.Undefined]: [],
};

export const metricNameByType = {
	[MetricType.Comments]: MetricName.Comments,
	[MetricType.Downloads]: MetricName.Downloads,
	[MetricType.Previews]: MetricName.Previews,
	[MetricType.Views]: MetricName.Views,
	[MetricType.Undefined]: MetricName.Undefined,
};

export type AssetMetricComplement = {
	metricType: 'percentage' | 'number' | 'long' | 'undefined';
	title: string;
};

export const assetMetricsComplement: {
	[key in MetricName]: AssetMetricComplement;
} = {
	[MetricName.Comments]: {
		metricType: 'number',
		title: Liferay.Language.get('total-comments'),
	},
	[MetricName.Downloads]: {
		metricType: 'number',
		title: Liferay.Language.get('total-downloads'),
	},
	[MetricName.Previews]: {
		metricType: 'number',
		title: Liferay.Language.get('total-previews'),
	},
	[MetricName.Views]: {
		metricType: 'number',
		title: Liferay.Language.get('total-views'),
	},
	[MetricName.Undefined]: {
		metricType: 'undefined',
		title: 'undefined',
	},
};
