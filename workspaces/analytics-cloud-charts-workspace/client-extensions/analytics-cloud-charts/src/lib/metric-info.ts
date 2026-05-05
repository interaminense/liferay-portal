/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Metric} from '../hooks/usePreferences';

export type MetricScope = 'asset-level' | 'page-level' | 'site-level';

export interface MetricInfo {
	description: string;
	label: string;
	scope: MetricScope;
}

export const METRIC_INFO: Record<Exclude<Metric, ''>, MetricInfo> = {
	acquisitions: {
		description:
			'Breakdown of traffic by Channel, Referrer, or Source/Medium. See where your visitors come from.',
		label: 'Acquisitions',
		scope: 'site-level',
	},
	audienceComposition: {
		description:
			'Total count of unique individuals tracked across the selected period.',
		label: 'Audience Size',
		scope: 'site-level',
	},
	devices: {
		description:
			'Distribution of page views by operating system and web browser used by visitors.',
		label: 'Devices',
		scope: 'page-level',
	},
	pageEngagement: {
		description:
			'Engagement trend for the current page: views, visitors, average time on page, bounce rate, entrances, and exit rate.',
		label: 'Page Engagement',
		scope: 'page-level',
	},
	pageOverview: {
		description:
			'Key page-level KPIs at a glance: views, visitors, average time on page, and bounce rate, each with a trend and a sparkline.',
		label: 'Page Overview',
		scope: 'page-level',
	},
	pagePath: {
		description:
			'Sankey diagram of how visitors arrive at and leave the current page through previous and following pages.',
		label: 'Page Path',
		scope: 'page-level',
	},
	searchTerms: {
		description:
			'Top 10 search queries entered by visitors on your site, ranked by frequency.',
		label: 'Search Terms',
		scope: 'site-level',
	},
	siteOverview: {
		description:
			'Key site-level KPIs at a glance: visitors, sessions, average session duration, and bounce rate, each with a trend and a sparkline.',
		label: 'Site Overview',
		scope: 'site-level',
	},
	topPages: {
		description:
			'Most visited, entrance, and exit pages of your site, ranked by visitors and exit rate. Click a row to open the page.',
		label: 'Top Pages',
		scope: 'site-level',
	},
	trafficHeatmap: {
		description:
			'Visitor volume by day of the week and hour of the day. Spot peak engagement times across the week.',
		label: 'Traffic Heatmap',
		scope: 'site-level',
	},
	visitFrequency: {
		description:
			'Distribution of visitors by how many times they have visited. Measures audience loyalty across frequency buckets.',
		label: 'Visit Frequency',
		scope: 'site-level',
	},
};

export const METRIC_OPTIONS: Array<Exclude<Metric, ''>> = [
	'acquisitions',
	'audienceComposition',
	'devices',
	'pageEngagement',
	'pageOverview',
	'pagePath',
	'searchTerms',
	'siteOverview',
	'topPages',
	'trafficHeatmap',
	'visitFrequency',
];
