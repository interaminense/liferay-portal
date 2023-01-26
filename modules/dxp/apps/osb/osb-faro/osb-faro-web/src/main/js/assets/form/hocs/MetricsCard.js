import FormMetricsQuery from 'shared/queries/FormMetricsQuery';
import getMetricsMapper from 'cerebro-shared/hocs/mappers/metrics';
import metrics from './metrics';
import {graphql} from '@apollo/react-hoc';
import {withMetricsCard} from 'cerebro-shared/hocs/MetricsCard';

/**
 * HOC
 * @description Forms Metrics
 */
const withFormsMetrics = () =>
	graphql(
		FormMetricsQuery,
		getMetricsMapper(result => result.form, metrics)
	);

export default withMetricsCard(withFormsMetrics);
