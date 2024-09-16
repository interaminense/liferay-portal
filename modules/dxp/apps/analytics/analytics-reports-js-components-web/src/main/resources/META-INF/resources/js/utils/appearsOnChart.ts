/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {utcFormat} from 'd3';

import {RangeSelectors} from '../types/global';
import {toUnix} from './date';
import {round, toThousands} from './math';
import {AssetMetricComplement} from './metrics';

export type AppearsOnHistogram = {
	metrics:
	{
		value: number;
		valueKey: string;
	}[];
	pageTitle: string;
};

export type Data = {
	appearsOnHistograms: AppearsOnHistogram[];
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
	Line1 = 'DATA_KEY_LINE_1',
	Line2 = 'DATA_KEY_LINE_2',
	Line3 = 'DATA_KEY_LINE_3',
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

interface FormatData extends AssetMetricComplement{
	data: Data;
}

export function formattedAppearsOnData({
	data,
	metricType,
}: FormatData): FormattedData | undefined {
	
	const appearsOnHistogram1 = data.appearsOnHistograms[0];

	const metricData1 = appearsOnHistogram1.metrics.map(({value}) => value);

	if (!appearsOnHistogram1) {
		return;
	}

	let metricData2;
	let metricData3;
	
	const axisXData = appearsOnHistogram1.metrics.map(({valueKey}) =>
		toUnix(valueKey)
	);
	
	if (data.appearsOnHistograms.length > 1) {
		const appearsOnHistogram2 = data.appearsOnHistograms[1];

		metricData2 = appearsOnHistogram2.metrics.map(({value}) => value);
	}

	if (data.appearsOnHistograms.length > 2) {
		const appearsOnHistogram3 = data.appearsOnHistograms[2];

		metricData3 = appearsOnHistogram3.metrics.map(({value}) => value);
	}

	const combinedData = [];

	for (let i = 0; i < axisXData.length; i++) {
		combinedData.push({
			[DataKey.AxisX]: axisXData[i],
			[DataKey.AxisY]: [null][i],
			[DataKey.Line1]: metricData1?.[i] ?? [null][i],
			[DataKey.Line2]: metricData2?.[i] ?? [null][i],
			[DataKey.Line3]: metricData3?.[i] ?? [null][i],
		});
	}


	return {
		combinedData,
		data: {
			[DataKey.AxisX]: {
				title: Liferay.Language.get('x'),
			},
			[DataKey.AxisY]: {
				title: Liferay.Language.get('y'),
			},
			[DataKey.Line1]: {
				format: formatter(metricType),
				title: data.appearsOnHistograms[0].pageTitle,
			},
			[DataKey.Line2]: {
				format: formatter(metricType),
				title: data.appearsOnHistograms[1].pageTitle,
			},
			[DataKey.Line3]: {
				format: formatter(metricType),
				title: data.appearsOnHistograms[2].pageTitle,
			},
		},
		intervals: axisXData,
	};
	
}

export function formatXAxisDate(dateKey: number, rangeSelector: string) {
	let formatter = utcFormat('%b %-d');

	if (rangeSelector === RangeSelectors.Last24Hours) {
		formatter = utcFormat('%-I %p');
	}

	return formatter(dateKey as unknown as Date);
}
