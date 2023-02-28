import getMetricsMapper from 'cerebro-shared/hocs/mappers/metrics';
import metrics from './metrics';
import TouchpointMetricsQuery from 'shared/queries/TouchpointMetricsQuery';
import {graphql} from '@apollo/react-hoc';
import {withMetricsCard} from 'cerebro-shared/hocs/MetricsCard';

/**
 * HOC
 * @description Touchpoint Metrics
 */
const withTouchpointMetrics = () =>
	graphql(
		TouchpointMetricsQuery,
		getMetricsMapper(result => result.page, metrics)
	);

export default withMetricsCard(withTouchpointMetrics, {
	legacyDropdownRangeKey: false
});
