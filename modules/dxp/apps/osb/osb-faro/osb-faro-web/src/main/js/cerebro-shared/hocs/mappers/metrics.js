import {getMetricsData} from 'shared/util/metrics';
import {getVariables, safeResultToProps} from 'shared/util/mappers';

/**
 * MAPPER
 * @description Get Metrics Mapper
 * @param {function} getData
 * @param {array} metrics
 */
const getMetricsMapper = (getData, metrics, chartDataMapFn) => {
	const mapResultToProps = safeResultToProps(
		(result, context, {rangeSelectors}) => ({
			items: getMetricsData(
				getData(result),
				metrics,
				rangeSelectors,
				chartDataMapFn
			)
		})
	);

	/**
	 * Map Props to Options
	 * @param {object} param0 props
	 * @param {object} param1 context
	 */
	const mapPropsToOptions = ({
		assetId: assetIdProps,
		filters,
		interval,
		rangeSelectors,
		router: {params}
	}) => {
		const {variables} = getVariables({
			filters,
			interval,
			params,
			rangeSelectors
		});

		return {
			variables: {
				...variables,
				assetId: decodeURIComponent(assetIdProps || params.assetId)
			}
		};
	};

	return {
		options: mapPropsToOptions,
		props: mapResultToProps
	};
};

export default getMetricsMapper;
export {getMetricsMapper};
