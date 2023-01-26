import BlogMetricsQuery from 'shared/queries/BlogMetricsQuery';
import getMetricsMapper from 'cerebro-shared/hocs/mappers/metrics';
import metrics from './metrics';
import {graphql} from '@apollo/react-hoc';
import {withMetricsCard} from 'cerebro-shared/hocs/MetricsCard';

/**
 * HOC
 * @description Blogs Metrics
 */
const withBlogsMetrics = () =>
	graphql(
		BlogMetricsQuery,
		getMetricsMapper(result => result.blog, metrics)
	);

export default withMetricsCard(withBlogsMetrics);
