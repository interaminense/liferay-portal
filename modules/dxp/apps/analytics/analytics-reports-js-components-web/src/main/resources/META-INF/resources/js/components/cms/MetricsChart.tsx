/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useContext} from 'react';

import {Context} from '../../Context';
import {MetricName} from '../../types/global';
import CurrentVsPreviousChart from './current-vs-previous/CurrentVsPreviousChart';

const mockedChartData = {
	histograms: [
		{
			metricName: MetricName.Impressions,
			metrics: [
				{
					previousValue: 836,
					previousValueKey: '2025-07-19T17:00',
					value: 970,
					valueKey: '2025-07-20T17:00',
				},
				{
					previousValue: 688,
					previousValueKey: '2025-07-19T18:00',
					value: 15,
					valueKey: '2025-07-20T18:00',
				},
				{
					previousValue: 116,
					previousValueKey: '2025-07-19T19:00',
					value: 318,
					valueKey: '2025-07-20T19:00',
				},
				{
					previousValue: 799,
					previousValueKey: '2025-07-19T20:00',
					value: 59,
					valueKey: '2025-07-20T20:00',
				},
				{
					previousValue: 974,
					previousValueKey: '2025-07-19T21:00',
					value: 18,
					valueKey: '2025-07-20T21:00',
				},
				{
					previousValue: 436,
					previousValueKey: '2025-07-19T22:00',
					value: 231,
					valueKey: '2025-07-20T22:00',
				},
				{
					previousValue: 824,
					previousValueKey: '2025-07-19T23:00',
					value: 506,
					valueKey: '2025-07-20T23:00',
				},
				{
					previousValue: 13,
					previousValueKey: '2025-07-20T00:00',
					value: 749,
					valueKey: '2025-07-21T00:00',
				},
				{
					previousValue: 552,
					previousValueKey: '2025-07-20T01:00',
					value: 556,
					valueKey: '2025-07-21T01:00',
				},
				{
					previousValue: 290,
					previousValueKey: '2025-07-20T02:00',
					value: 967,
					valueKey: '2025-07-21T02:00',
				},
				{
					previousValue: 854,
					previousValueKey: '2025-07-20T03:00',
					value: 730,
					valueKey: '2025-07-21T03:00',
				},
				{
					previousValue: 76,
					previousValueKey: '2025-07-20T04:00',
					value: 72,
					valueKey: '2025-07-21T04:00',
				},
				{
					previousValue: 971,
					previousValueKey: '2025-07-20T05:00',
					value: 838,
					valueKey: '2025-07-21T05:00',
				},
				{
					previousValue: 236,
					previousValueKey: '2025-07-20T06:00',
					value: 754,
					valueKey: '2025-07-21T06:00',
				},
				{
					previousValue: 488,
					previousValueKey: '2025-07-20T07:00',
					value: 643,
					valueKey: '2025-07-21T07:00',
				},
				{
					previousValue: 311,
					previousValueKey: '2025-07-20T08:00',
					value: 251,
					valueKey: '2025-07-21T08:00',
				},
				{
					previousValue: 580,
					previousValueKey: '2025-07-20T09:00',
					value: 18,
					valueKey: '2025-07-21T09:00',
				},
				{
					previousValue: 189,
					previousValueKey: '2025-07-20T10:00',
					value: 54,
					valueKey: '2025-07-21T10:00',
				},
				{
					previousValue: 31,
					previousValueKey: '2025-07-20T11:00',
					value: 388,
					valueKey: '2025-07-21T11:00',
				},
				{
					previousValue: 671,
					previousValueKey: '2025-07-20T12:00',
					value: 953,
					valueKey: '2025-07-21T12:00',
				},
				{
					previousValue: 756,
					previousValueKey: '2025-07-20T13:00',
					value: 77,
					valueKey: '2025-07-21T13:00',
				},
				{
					previousValue: 232,
					previousValueKey: '2025-07-20T14:00',
					value: 17,
					valueKey: '2025-07-21T14:00',
				},
				{
					previousValue: 420,
					previousValueKey: '2025-07-20T15:00',
					value: 784,
					valueKey: '2025-07-21T15:00',
				},
				{
					previousValue: 132,
					previousValueKey: '2025-07-20T16:00',
					value: 387,
					valueKey: '2025-07-21T16:00',
				},
			],
			total: 1231,
			totalValue: 3000,
		},
		{
			metricName: MetricName.Downloads,
			metrics: [
				{
					previousValue: 171,
					previousValueKey: '2025-07-19T17:00',
					value: 37,
					valueKey: '2025-07-20T17:00',
				},
				{
					previousValue: 29,
					previousValueKey: '2025-07-19T18:00',
					value: 965,
					valueKey: '2025-07-20T18:00',
				},
				{
					previousValue: 24,
					previousValueKey: '2025-07-19T19:00',
					value: 500,
					valueKey: '2025-07-20T19:00',
				},
				{
					previousValue: 234,
					previousValueKey: '2025-07-19T20:00',
					value: 399,
					valueKey: '2025-07-20T20:00',
				},
				{
					previousValue: 576,
					previousValueKey: '2025-07-19T21:00',
					value: 97,
					valueKey: '2025-07-20T21:00',
				},
				{
					previousValue: 296,
					previousValueKey: '2025-07-19T22:00',
					value: 416,
					valueKey: '2025-07-20T22:00',
				},
				{
					previousValue: 11,
					previousValueKey: '2025-07-19T23:00',
					value: 303,
					valueKey: '2025-07-20T23:00',
				},
				{
					previousValue: 338,
					previousValueKey: '2025-07-20T00:00',
					value: 580,
					valueKey: '2025-07-21T00:00',
				},
				{
					previousValue: 636,
					previousValueKey: '2025-07-20T01:00',
					value: 264,
					valueKey: '2025-07-21T01:00',
				},
				{
					previousValue: 885,
					previousValueKey: '2025-07-20T02:00',
					value: 113,
					valueKey: '2025-07-21T02:00',
				},
				{
					previousValue: 374,
					previousValueKey: '2025-07-20T03:00',
					value: 981,
					valueKey: '2025-07-21T03:00',
				},
				{
					previousValue: 843,
					previousValueKey: '2025-07-20T04:00',
					value: 859,
					valueKey: '2025-07-21T04:00',
				},
				{
					previousValue: 762,
					previousValueKey: '2025-07-20T05:00',
					value: 982,
					valueKey: '2025-07-21T05:00',
				},
				{
					previousValue: 152,
					previousValueKey: '2025-07-20T06:00',
					value: 598,
					valueKey: '2025-07-21T06:00',
				},
				{
					previousValue: 966,
					previousValueKey: '2025-07-20T07:00',
					value: 324,
					valueKey: '2025-07-21T07:00',
				},
				{
					previousValue: 494,
					previousValueKey: '2025-07-20T08:00',
					value: 387,
					valueKey: '2025-07-21T08:00',
				},
				{
					previousValue: 894,
					previousValueKey: '2025-07-20T09:00',
					value: 13,
					valueKey: '2025-07-21T09:00',
				},
				{
					previousValue: 846,
					previousValueKey: '2025-07-20T10:00',
					value: 478,
					valueKey: '2025-07-21T10:00',
				},
				{
					previousValue: 399,
					previousValueKey: '2025-07-20T11:00',
					value: 130,
					valueKey: '2025-07-21T11:00',
				},
				{
					previousValue: 824,
					previousValueKey: '2025-07-20T12:00',
					value: 833,
					valueKey: '2025-07-21T12:00',
				},
				{
					previousValue: 737,
					previousValueKey: '2025-07-20T13:00',
					value: 801,
					valueKey: '2025-07-21T13:00',
				},
				{
					previousValue: 462,
					previousValueKey: '2025-07-20T14:00',
					value: 401,
					valueKey: '2025-07-21T14:00',
				},
				{
					previousValue: 483,
					previousValueKey: '2025-07-20T15:00',
					value: 805,
					valueKey: '2025-07-21T15:00',
				},
				{
					previousValue: 878,
					previousValueKey: '2025-07-20T16:00',
					value: 595,
					valueKey: '2025-07-21T16:00',
				},
			],
			total: 1231,
			totalValue: 3000,
		},
		{
			metricName: MetricName.Views,
			metrics: [
				{
					previousValue: 103,
					previousValueKey: '2025-07-19T17:00',
					value: 48,
					valueKey: '2025-07-20T17:00',
				},
				{
					previousValue: 25,
					previousValueKey: '2025-07-19T18:00',
					value: 566,
					valueKey: '2025-07-20T18:00',
				},
				{
					previousValue: 382,
					previousValueKey: '2025-07-19T19:00',
					value: 684,
					valueKey: '2025-07-20T19:00',
				},
				{
					previousValue: 525,
					previousValueKey: '2025-07-19T20:00',
					value: 990,
					valueKey: '2025-07-20T20:00',
				},
				{
					previousValue: 663,
					previousValueKey: '2025-07-19T21:00',
					value: 256,
					valueKey: '2025-07-20T21:00',
				},
				{
					previousValue: 372,
					previousValueKey: '2025-07-19T22:00',
					value: 353,
					valueKey: '2025-07-20T22:00',
				},
				{
					previousValue: 217,
					previousValueKey: '2025-07-19T23:00',
					value: 124,
					valueKey: '2025-07-20T23:00',
				},
				{
					previousValue: 37,
					previousValueKey: '2025-07-20T00:00',
					value: 738,
					valueKey: '2025-07-21T00:00',
				},
				{
					previousValue: 623,
					previousValueKey: '2025-07-20T01:00',
					value: 164,
					valueKey: '2025-07-21T01:00',
				},
				{
					previousValue: 396,
					previousValueKey: '2025-07-20T02:00',
					value: 659,
					valueKey: '2025-07-21T02:00',
				},
				{
					previousValue: 637,
					previousValueKey: '2025-07-20T03:00',
					value: 614,
					valueKey: '2025-07-21T03:00',
				},
				{
					previousValue: 157,
					previousValueKey: '2025-07-20T04:00',
					value: 327,
					valueKey: '2025-07-21T04:00',
				},
				{
					previousValue: 22,
					previousValueKey: '2025-07-20T05:00',
					value: 249,
					valueKey: '2025-07-21T05:00',
				},
				{
					previousValue: 445,
					previousValueKey: '2025-07-20T06:00',
					value: 335,
					valueKey: '2025-07-21T06:00',
				},
				{
					previousValue: 651,
					previousValueKey: '2025-07-20T07:00',
					value: 169,
					valueKey: '2025-07-21T07:00',
				},
				{
					previousValue: 275,
					previousValueKey: '2025-07-20T08:00',
					value: 84,
					valueKey: '2025-07-21T08:00',
				},
				{
					previousValue: 482,
					previousValueKey: '2025-07-20T09:00',
					value: 358,
					valueKey: '2025-07-21T09:00',
				},
				{
					previousValue: 681,
					previousValueKey: '2025-07-20T10:00',
					value: 63,
					valueKey: '2025-07-21T10:00',
				},
				{
					previousValue: 386,
					previousValueKey: '2025-07-20T11:00',
					value: 670,
					valueKey: '2025-07-21T11:00',
				},
				{
					previousValue: 808,
					previousValueKey: '2025-07-20T12:00',
					value: 944,
					valueKey: '2025-07-21T12:00',
				},
				{
					previousValue: 96,
					previousValueKey: '2025-07-20T13:00',
					value: 699,
					valueKey: '2025-07-21T13:00',
				},
				{
					previousValue: 973,
					previousValueKey: '2025-07-20T14:00',
					value: 466,
					valueKey: '2025-07-21T14:00',
				},
				{
					previousValue: 596,
					previousValueKey: '2025-07-20T15:00',
					value: 884,
					valueKey: '2025-07-21T15:00',
				},
				{
					previousValue: 634,
					previousValueKey: '2025-07-20T16:00',
					value: 259,
					valueKey: '2025-07-21T16:00',
				},
			],
			total: 1231,
			totalValue: 3000,
		},
	],
};

const MetricsChart = () => {
	const {filters} = useContext(Context);

	return (
		<CurrentVsPreviousChart
			data={mockedChartData}
			metricType={filters.metric}
		/>
	);
};

export {MetricsChart};
