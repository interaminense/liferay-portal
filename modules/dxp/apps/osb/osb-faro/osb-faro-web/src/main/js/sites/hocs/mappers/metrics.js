import {getMetricsData, getSiteMetricsChartData} from 'shared/util/metrics';
import {getSafeRangeSelectors} from 'shared/util/util';
import {safeResultToProps} from 'shared/util/mappers';

/**
 * MAPPER
 * @description Get Metrics Mapper
 * @param {function} getData
 * @param {array} metrics
 */
const getMetricsMapper = (getData, metrics) => {
	const mapResultToProps = safeResultToProps(
		(result, context, {interval, rangeSelectors}) => ({
			items: getMetricsData(
				getData(result),
				metrics,
				rangeSelectors,
				getSiteMetricsChartData,
				interval
			)
		})
	);

	/**
	 * Map Props to Options
	 * @param {object} param0 props
	 * @param {object} param1 context
	 */
	const mapPropsToOptions = ({
		channelId,
		interval,
		rangeSelectors,
		router: {params}
	}) => ({
		variables: {
			channelId: channelId || params.channelId,
			interval,
			...getSafeRangeSelectors(rangeSelectors)
		}
	});

	return {
		options: mapPropsToOptions,
		props: mapResultToProps
	};
};

export default getMetricsMapper;
export {getMetricsMapper};
