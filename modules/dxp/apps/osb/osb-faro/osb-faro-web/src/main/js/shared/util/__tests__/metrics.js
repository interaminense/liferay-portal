jest.unmock('clay-charts');

import * as data from 'test/data';
import siteMetrics from 'sites/hocs/metrics';
import {CHART_COLOR_NAMES} from 'shared/components/Chart';
import {Colors, getIntervals} from 'shared/util/charts';
import {
	convertHistogramKeysToDate,
	getIcon,
	getMetricsChartData,
	getMetricsData,
	getSiteMetricsChartData,
	getStatsColor,
	Icons
} from '../metrics';
import {Map} from 'immutable';
import {toUnix} from 'shared/util/date';

const {stark: CHART_BLUE, starkL2: CHART_BLUE_L2} = CHART_COLOR_NAMES;

describe('convertHistogramKeysToDate', () => {
	it('should convert the histogram date key strings to Date types', () => {
		expect(
			[
				{
					key: '2018-07-16T00:00',
					previousValueKey: '2018-07-15T00:00',
					value: 15,
					valueKey: '2018-07-16T00:00'
				}
			].map(convertHistogramKeysToDate)
		).toMatchSnapshot();
	});
});

describe('getMetricsData', () => {
	it('should return the chart items', () => {
		const rangeKey = 30;
		const keyDate = '2018-07-16T00:00';
		const valueKeyDate = '1531699200000';
		const previousValueKeyDate = '1531612800000';
		const metrics = [
			{
				name: 'comments',
				sortField: 'comments',
				title: 'comments',
				tooltipTitle: 'Avg. Comments',
				type: 'number'
			},
			{
				name: 'views',
				sortField: 'views',
				title: 'Views',
				tooltipTitle: 'Avg. Views',
				type: 'number'
			}
		];

		const result = {
			comments: {
				histogram: {
					asymmetricalComparison: false,
					metrics: [
						{
							key: keyDate,
							previousValue: 0,
							previousValueKey: previousValueKeyDate,
							trend: {
								percentage: 10,
								trendClassification: 'NEUTRAL'
							},
							value: 15,
							valueKey: valueKeyDate
						}
					]
				},
				trend: {
					percentage: 10,
					trendClassification: 'NEUTRAL'
				}
			},
			views: {
				histogram: {
					asymmetricalComparison: false,
					metrics: [
						{
							key: keyDate,
							previousValue: 0,
							previousValueKey: previousValueKeyDate,
							trend: {
								percentage: 10,
								trendClassification: 'NEUTRAL'
							},
							value: 5,
							valueKey: valueKeyDate
						}
					]
				},
				trend: {
					percentage: -100,
					trendClassification: 'NEGATIVE'
				}
			}
		};
		const metricsData = getMetricsData(result, metrics, {rangeKey});

		const dateKeysIMap = new Map([
			[toUnix(keyDate), [toUnix(valueKeyDate)]]
		]);
		const prevDateKeysIMap = new Map([
			[toUnix(keyDate), [toUnix(previousValueKeyDate)]]
		]);

		metricsData.forEach(metricData => {
			delete metricData.format;
		});

		expect(metricsData).toEqual([
			{
				content: {
					details: {
						color: '#AEB0BB',
						icon: 'caret-top-l',
						label: '10%'
					},
					name: 'comments',
					title: 'comments',
					type: 'number',
					value: ''
				},
				data: [
					{
						color: CHART_BLUE,
						data: [15],
						id: 'data_1',
						name: 'Avg. Comments',
						tooltipTitle: 'Avg. Comments'
					},
					{
						color: CHART_BLUE_L2,
						data: [0],
						id: 'data_previous',
						name: 'Previous Period'
					},
					{data: [toUnix(keyDate)], id: 'x'}
				],
				dateKeysIMap,
				intervals: getIntervals(
					rangeKey,
					[toUnix(keyDate)],
					'D',
					dateKeysIMap
				),
				prevDateKeysIMap
			},
			{
				content: {
					details: {
						color: '#DA1414',
						icon: 'caret-bottom-l',
						label: '100%'
					},
					name: 'views',
					title: 'Views',
					type: 'number',
					value: ''
				},
				data: [
					{
						color: CHART_BLUE,
						data: [5],
						id: 'data_1',
						name: 'Avg. Views',
						tooltipTitle: 'Avg. Views'
					},
					{
						color: CHART_BLUE_L2,
						data: [0],
						id: 'data_previous',
						name: 'Previous Period'
					},
					{data: [toUnix(keyDate)], id: 'x'}
				],
				dateKeysIMap,
				intervals: getIntervals(
					rangeKey,
					[toUnix(keyDate)],
					'D',
					dateKeysIMap
				),
				prevDateKeysIMap
			}
		]);
	});
});

describe('getStatsColor', () => {
	it('should be return the neutral color if no color is specificated', () => {
		const color = getStatsColor();

		expect(color).toEqual(Colors.neutral);
	});

	it('should be return the positive color', () => {
		const color = getStatsColor('POSITIVE');

		expect(color).toEqual(Colors.positive);
	});

	it('should be return the negative color', () => {
		const color = getStatsColor('NEGATIVE');

		expect(color).toEqual(Colors.negative);
	});

	it('should be return the neutral color', () => {
		const color = getStatsColor('NEUTRAL');

		expect(color).toEqual(Colors.neutral);
	});
});

describe('getIcon', () => {
	it('should be return the current icon based in a positive number', () => {
		const icon = getIcon(10);

		expect(icon).toEqual(Icons.positive);
	});

	it('should be return the current icon based in a negative number', () => {
		const icon = getIcon(-10);

		expect(icon).toEqual(Icons.negative);
	});

	it('should be return the current icon based in zero number', () => {
		const icon = getIcon(0);

		expect(icon).toEqual(Icons.neutral);
	});
});

describe('getMetricsChartData', () => {
	it('should return data formatted for use in a Metrics chart', () => {
		const mockParameters = {
			histogram: data
				.mockMetricFragment(10)
				.histogram.metrics.map(convertHistogramKeysToDate),
			name: 'fooMetric',
			title: '',
			tooltipTitle: '',
			type: 'number'
		};

		expect(getMetricsChartData(mockParameters)).toMatchSnapshot();
	});
});

describe('getSiteMetricsChartData', () => {
	it('should return data formatted for use in a Site Metrics chart', () => {
		const {name, title, tooltipTitle, type} = siteMetrics[0];

		const mockParameters = {
			compositeData: {
				anonymousVisitorsMetric: data
					.mockMetricFragment(25)
					.histogram.metrics.map(convertHistogramKeysToDate),
				knownVisitorsMetric: data
					.mockMetricFragment(55)
					.histogram.metrics.map(convertHistogramKeysToDate)
			},
			histogram: data
				.mockMetricFragment(85)
				.histogram.metrics.map(convertHistogramKeysToDate),
			name,
			title,
			tooltipTitle,
			type
		};
		expect(getSiteMetricsChartData(mockParameters)).toMatchSnapshot();
	});
});
