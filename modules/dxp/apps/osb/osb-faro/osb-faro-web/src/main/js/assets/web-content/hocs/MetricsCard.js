import getMetricsMapper from 'cerebro-shared/hocs/mappers/metrics';
import metrics from './metrics';
import WebContentMetricsQuery from 'shared/queries/WebContentMetricsQuery';
import {graphql} from '@apollo/react-hoc';
import {withMetricsCard} from 'cerebro-shared/hocs/MetricsCard';

/**
 * HOC
 * @description Web Content Metrics
 */
const withWebContentMetrics = () =>
	graphql(
		WebContentMetricsQuery,
		getMetricsMapper(result => result.journal, metrics)
	);

export default withMetricsCard(withWebContentMetrics);
