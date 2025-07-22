/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useContext} from 'react';

import {AnalyticsReportsContext} from '../../AnalyticsReportsContext';
import {MetricName} from '../../types/global';
import CurrentVsPreviousChart from './current-vs-previous/CurrentVsPreviousChart';

const mockedChartData = {
	histograms: [
		{
			metricName: MetricName.Impressions,
			metrics: [
				{
					previousValue: 21,
					previousValueKey: '2025-07-19T17:00',
					value: 13,
					valueKey: '2025-07-20T17:00',
				},
				{
					previousValue: 11,
					previousValueKey: '2025-07-19T18:00',
					value: 32,
					valueKey: '2025-07-20T18:00',
				},
				{
					previousValue: 30,
					previousValueKey: '2025-07-19T19:00',
					value: 33,
					valueKey: '2025-07-20T19:00',
				},
				{
					previousValue: 33,
					previousValueKey: '2025-07-19T20:00',
					value: 31,
					valueKey: '2025-07-20T20:00',
				},
				{
					previousValue: 38,
					previousValueKey: '2025-07-19T21:00',
					value: 12,
					valueKey: '2025-07-20T21:00',
				},
				{
					previousValue: 12,
					previousValueKey: '2025-07-19T22:00',
					value: 37,
					valueKey: '2025-07-20T22:00',
				},
				{
					previousValue: 27,
					previousValueKey: '2025-07-19T23:00',
					value: 10,
					valueKey: '2025-07-20T23:00',
				},
				{
					previousValue: 21,
					previousValueKey: '2025-07-20T00:00',
					value: 18,
					valueKey: '2025-07-21T00:00',
				},
				{
					previousValue: 42,
					previousValueKey: '2025-07-20T01:00',
					value: 84,
					valueKey: '2025-07-21T01:00',
				},
				{
					previousValue: 20,
					previousValueKey: '2025-07-20T02:00',
					value: 28,
					valueKey: '2025-07-21T02:00',
				},
				{
					previousValue: 2,
					previousValueKey: '2025-07-20T03:00',
					value: 41,
					valueKey: '2025-07-21T03:00',
				},
				{
					previousValue: 12,
					previousValueKey: '2025-07-20T04:00',
					value: 21,
					valueKey: '2025-07-21T04:00',
				},
				{
					previousValue: 1,
					previousValueKey: '2025-07-20T05:00',
					value: 31,
					valueKey: '2025-07-21T05:00',
				},
				{
					previousValue: 13,
					previousValueKey: '2025-07-20T06:00',
					value: 41,
					valueKey: '2025-07-21T06:00',
				},
				{
					previousValue: 33,
					previousValueKey: '2025-07-20T07:00',
					value: 23,
					valueKey: '2025-07-21T07:00',
				},
				{
					previousValue: 38,
					previousValueKey: '2025-07-20T08:00',
					value: 39,
					valueKey: '2025-07-21T08:00',
				},
				{
					previousValue: 36,
					previousValueKey: '2025-07-20T09:00',
					value: 29,
					valueKey: '2025-07-21T09:00',
				},
				{
					previousValue: 33,
					previousValueKey: '2025-07-20T10:00',
					value: 26,
					valueKey: '2025-07-21T10:00',
				},
				{
					previousValue: 19,
					previousValueKey: '2025-07-20T11:00',
					value: 30,
					valueKey: '2025-07-21T11:00',
				},
				{
					previousValue: 22,
					previousValueKey: '2025-07-20T12:00',
					value: 47,
					valueKey: '2025-07-21T12:00',
				},
				{
					previousValue: 21,
					previousValueKey: '2025-07-20T13:00',
					value: 94,
					valueKey: '2025-07-21T13:00',
				},
				{
					previousValue: 7,
					previousValueKey: '2025-07-20T14:00',
					value: 23,
					valueKey: '2025-07-21T14:00',
				},
				{
					previousValue: 7,
					previousValueKey: '2025-07-20T15:00',
					value: 32,
					valueKey: '2025-07-21T15:00',
				},
				{
					previousValue: 21,
					previousValueKey: '2025-07-20T16:00',
					value: 3,
					valueKey: '2025-07-21T16:00',
				},
			],
			total: 1231,
			totalValue: 3000,
		},
	],
};

const MetricsChart = () => {
	const {filters} = useContext(AnalyticsReportsContext);

	return (
		<CurrentVsPreviousChart
			data={mockedChartData}
			metricType={filters.metric}
		/>
	);
};

export {MetricsChart};
