/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {utcFormat} from 'd3';

import {MetricName, RangeSelectors} from '../types/global';
import {toUnix} from './date';
import {round, toThousands} from './math';
import {AssetMetricComplement} from './metrics';

export type Histogram = {
	metricName: MetricName;
	metrics:
		| {
				value: number;
				valueKey: string;
		  }[]
		| [];
	total: number;
};

export type Data = {
	histograms: Histogram[];
};

export type ChartData = {
	format?: (value: any) => any;
	title: string;
};

export type FormattedData = {
	combinedData: {[key in DataKey]: number | null}[];
	data: {
		[key in DataKey]: ChartData;
	};
	intervals: (number | null)[];
};

export enum DataKey {
	AxisX = 'x',
	AxisY = 'y',
	Metric = 'METRIC_DATA_KEY',
	PublishedVersionData = 'PUBLISHED_VERSION_DATA_KEY',
	PublishedVersionValue = 'PUBLISHED_VERSION_VALUE_KEY',
}

export function getFillOpacity(id: DataKey, hoveredItemId: DataKey | null) {
	return hoveredItemId === id || !hoveredItemId ? 1 : 0.2;
}

export function formatter(type: AssetMetricComplement['metricType']) {
	if (type === 'percentage') {
		return (value: number) => `${round(value * 100)}%`;
	}

	if (type === 'number') {
		return (value: number) => `${toThousands(value)}`;
	}

	if (type === 'long') {
		return (value: number) => value.toFixed(1);
	}

	return (value: number) => value;
}

interface FormatData extends AssetMetricComplement {
	data: Data;
	metricName: MetricName;
}

export function formattedVisitorsBehaviorData({
	data,
	metricName,
	metricType,
	title,
}: FormatData): FormattedData | undefined {
	const selectedHistogram = data.histograms.find(
		({metricName: currentMetricName}) => metricName === currentMetricName
	);

	if (selectedHistogram?.metrics.length) {
		const metricData = selectedHistogram.metrics.map(({value}) => value);
		const publishedVersionData = [
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			0,
			null,
			null,
			null,
			null,
			null,
			0,
			null,
			0,
			null,
			null,
			null,
			null,
			null,
		];

		const publishedVersionValueData = [
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			2.0,
			null,
			null,
			null,
			null,
			null,
			2.0,
			null,
			2.0,
			null,
			null,
			null,
			null,
			null,
		];
		const axisXData = selectedHistogram.metrics.map(({valueKey}) =>
			toUnix(valueKey)
		);

		const combinedData = [];

		for (let i = 0; i < axisXData.length; i++) {
			combinedData.push({
				[DataKey.AxisX]: axisXData[i],
				[DataKey.AxisY]: [null][i],
				[DataKey.Metric]: metricData[i],
				[DataKey.PublishedVersionData]: publishedVersionData[i],
				[DataKey.PublishedVersionValue]: publishedVersionValueData[i],
			});
		}

		return {
			combinedData,
			data: {
				[DataKey.Metric]: {
					format: formatter(metricType),
					title,
				},
				[DataKey.PublishedVersionData]: {
					format: formatter('long'),
					title: Liferay.Language.get('published-version'),
				},
				[DataKey.PublishedVersionValue]: {
					title: Liferay.Language.get('published-version'),
				},
				[DataKey.AxisX]: {
					title: Liferay.Language.get('x'),
				},
				[DataKey.AxisY]: {
					title: Liferay.Language.get('y'),
				},
			},
			intervals: axisXData,
		};
	}

	return;
}

export function formatXAxisDate(dateKey: number, rangeSelector: string) {
	let formatter = utcFormat('%b %-d');

	if (rangeSelector === RangeSelectors.Last24Hours) {
		formatter = utcFormat('%-I %p');
	}

	return formatter(dateKey as unknown as Date);
}
