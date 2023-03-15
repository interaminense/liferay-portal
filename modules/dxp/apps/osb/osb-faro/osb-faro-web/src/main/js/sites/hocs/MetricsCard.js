import getMetricsMapper from './mappers/metrics';
import metrics from './metrics';
import SiteMetricsQuery from 'shared/queries/SiteMetricsQuery';
import {graphql} from '@apollo/react-hoc';
import {withMetricsCard} from 'cerebro-shared/hocs/MetricsCard';

/**
 * HOC
 * @description Site Metrics
 */
const withSiteMetrics = () =>
	graphql(
		SiteMetricsQuery,
		getMetricsMapper(result => result.site, metrics)
	);

export default withMetricsCard(withSiteMetrics, {
	legacyDropdownRangeKey: false,
	showInterval: true
});
