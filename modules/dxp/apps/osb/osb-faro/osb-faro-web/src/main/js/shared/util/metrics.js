import {CHART_COLOR_NAMES} from 'shared/components/Chart';
import {
	CHART_DATA_ID_1,
	CHART_DATA_ID_2,
	CHART_DATA_PREVIOUS,
	METRIC_TOOLTIP_LABEL_MAP
} from 'cerebro-shared/components/Metrics';
import {
	Colors,
	getAxisFormatter,
	getDataFormatter,
	getIntervals,
	getMetricFormatter
} from 'shared/util/charts';
import {INTERVAL_KEY_MAP} from 'shared/util/time';
import {Map} from 'immutable';
import {toRounded} from 'shared/util/numbers';
import {toUnix} from 'shared/util/date';

const {
	martell: CHART_GREEN,
	martellL2: CHART_GREEN_L2,
	mormont: CHART_ORANGE,
	stark: CHART_BLUE,
	starkL2: CHART_BLUE_L2
} = CHART_COLOR_NAMES;

export const Icons = {
	negative: 'caret-bottom-l',
	neutral: undefined,
	positive: 'caret-top-l'
};

const PREVIOUS_PERIOD_VISITORS_COLOR = '#393A4A';

/**
 * @typedef {Object} Histogram
 * @property {string} key - The key date string.
 * @property {string} previousValueKey - Previous value date string. Includes slash if a range.
 * @property {string} valueKey - Value date string. Includes slash if a range.
 */

/**
 * @typedef {Object} HistogramWithDateValues
 * @property {Date} key - The key Date.
 * @property {Array.<Date>} previousValueKey - Array containing previous value Date Object. Optional second Date if a range.
 * @property {Array.<Date>} valueKey - Array containing Date Object. Optional second Date if a range.
 */

/**
 * Converts date strings in histogram to Date Objects.
 * @param {Histogram}
 * @returns {HistogramWithDateValues}
 */
export const convertHistogramKeysToDate = ({
	key,
	previousValueKey,
	valueKey,
	...otherParams
}) => ({
	key: toUnix(key),
	previousValueKey: previousValueKey.split('/').map(toUnix),
	valueKey: valueKey.split('/').map(toUnix),
	...otherParams
});

/**
 * Return the icon name
 * @param {number} number
 */
export const getIcon = number => {
	if (number > 0) {
		return Icons.positive;
	} else if (number < 0) {
		return Icons.negative;
	} else {
		return Icons.neutral;
	}
};

/**
 * Take formatted historical data for a metric and return
 * for use in the Metrics chart.
 * @param {Object}  metric - The metric to display in a chart.
 * @param {Object}  metric.histogram - The historical data for the metric.
 * @param {string}  metric.name
 * @param {string}  metric.title
 * @param {string?} metric.tooltipTitle
 * @param {string}  metric.type
 * @returns {Array}
 */
export const getMetricsChartData = ({
	histogram,
	name,
	title,
	tooltipTitle,
	type
}) => [
	{
		color: CHART_BLUE,
		data: getDataFormatter(type)(histogram.map(({value}) => value)),
		id: CHART_DATA_ID_1,
		name: tooltipTitle || METRIC_TOOLTIP_LABEL_MAP[name] || title,
		tooltipTitle
	},
	{
		color: CHART_BLUE_L2,
		data: getDataFormatter(type)(
			histogram.map(({previousValue}) => previousValue)
		),
		id: CHART_DATA_PREVIOUS,
		name: Liferay.Language.get('previous-period')
	},
	{
		data: histogram.map(({key}) => key),
		id: 'x'
	}
];

/**
 * Return the chart items
 * @memberOf TabbledLinesMetrics
 * @param {object} result
 * @param {object} metrics
 * @param {object} rangeSelectors
 */
export const getMetricsData = (
	result,
	metrics,
	rangeSelectors = {},
	chartDataMapFn = getMetricsChartData,
	timeInterval = INTERVAL_KEY_MAP.day
) =>
	metrics.map(({compositeMetrics, name, title, tooltipTitle, type}) => {
		const metricFormatter = getMetricFormatter(type);

		const histogram = result[name].histogram.metrics.map(
			convertHistogramKeysToDate
		);

		const compositeData = compositeMetrics
			? {
					compositeContent: compositeMetrics.reduce(
						(
							acc,
							{
								name: compositeMetricName,
								title: compositeMetricTitle,
								type: compositeMetricType
							}
						) => {
							acc[compositeMetricName] = {
								details: {
									color: getStatsColor(
										result[compositeMetricName].trend
											.trendClassification
									),
									icon: getIcon(
										result[compositeMetricName].trend
											.percentage
									),
									label: `${toRounded(
										Math.abs(
											result[compositeMetricName].trend
												.percentage
										)
									)}%`
								},
								name: compositeMetricName,
								title: compositeMetricTitle,
								type: compositeMetricType,
								value: metricFormatter(
									result[compositeMetricName].value
								)
							};

							return acc;
						},
						{}
					),
					compositeData: compositeMetrics.reduce(
						(acc, {name: compositeMetricName}) => {
							acc[compositeMetricName] =
								result[compositeMetricName].histogram.metrics;

							return acc;
						},
						{}
					)
			  }
			: {};

		const dateKeysIMap = new Map(
			histogram.map(({key, valueKey}) => [key, valueKey])
		);

		return {
			...compositeData,
			asymmetricComparison: result[name].histogram.asymmetricComparison,
			content: {
				details: {
					color: getStatsColor(
						result[name].trend.trendClassification
					),
					icon: getIcon(result[name].trend.percentage),
					label: `${toRounded(
						Math.abs(result[name].trend.percentage)
					)}%`
				},
				name,
				title,
				type,
				value: metricFormatter(result[name].value)
			},
			data: chartDataMapFn({
				...compositeData,
				histogram,
				name,
				title,
				tooltipTitle,
				type
			}),
			dateKeysIMap,
			format: getAxisFormatter(type),
			intervals: getIntervals(
				rangeSelectors.rangeKey,
				histogram.map(({key}) => key),
				timeInterval,
				dateKeysIMap
			),
			prevDateKeysIMap: new Map(
				histogram.map(({key, previousValueKey}) => [
					key,
					previousValueKey
				])
			)
		};
	});

/**
 * Take formatted historical data for a metric and return
 * for use in the Site Metrics chart.
 * @param {Object}  metric - The metric to display in a chart.
 * @param {Object}  metric.histogram - The historical data for the metric.
 * @param {string}  metric.name
 * @param {string}  metric.title
 * @param {string?} metric.tooltipTitle
 * @param {string}  metric.type
 * @returns {Array}
 */
export const getSiteMetricsChartData = ({
	compositeData,
	histogram,
	name,
	title,
	tooltipTitle,
	type
}) =>
	name === 'visitorsMetric'
		? [
				{
					color: CHART_BLUE,
					data: getDataFormatter(type)(
						compositeData.knownVisitorsMetric.map(
							({value}) => value
						)
					),
					dataName: 'knownVisitorsMetric',
					id: CHART_DATA_ID_1,
					name: Liferay.Language.get('known-visitors'),
					tooltipTitle: Liferay.Language.get('known'),
					type: 'bar'
				},
				{
					color: CHART_ORANGE,
					data: getDataFormatter(type)(
						compositeData.anonymousVisitorsMetric.map(
							({value}) => value
						)
					),
					dataName: 'anonymousVisitorsMetric',
					id: CHART_DATA_ID_2,
					name: Liferay.Language.get('anonymous-visitors'),
					tooltipTitle: Liferay.Language.get('anonymous'),
					type: 'bar'
				},
				{
					color: PREVIOUS_PERIOD_VISITORS_COLOR,
					data: getDataFormatter(type)(
						histogram.map(({previousValue}) => previousValue)
					),
					id: CHART_DATA_PREVIOUS,
					name: Liferay.Language.get('previous-period'),
					type: 'line'
				},
				{
					data: histogram.map(({key}) => key),
					id: 'x'
				}
		  ]
		: getMetricsChartData({histogram, name, title, tooltipTitle, type}).map(
				data =>
					[CHART_DATA_ID_1, CHART_DATA_PREVIOUS].includes(data.id)
						? {
								...data,
								color:
									data.id === CHART_DATA_PREVIOUS
										? CHART_GREEN_L2
										: CHART_GREEN
						  }
						: data
		  );

/**
 * Return the current color
 * @param {string} str
 */
export const getStatsColor = str => {
	if (str) {
		if (str.toLowerCase() == 'positive') {
			return Colors.positive;
		} else if (str.toLowerCase() == 'negative') {
			return Colors.negative;
		} else {
			return Colors.neutral;
		}
	} else {
		return Colors.neutral;
	}
};
