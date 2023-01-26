import DocumentsAndMediaMetricsQuery from 'shared/queries/DocumentsAndMediaMetricsQuery';
import getMetricsMapper from 'cerebro-shared/hocs/mappers/metrics';
import metrics from './metrics';
import {graphql} from '@apollo/react-hoc';
import {withMetricsCard} from 'cerebro-shared/hocs/MetricsCard';

/**
 * HOC
 * @description Documents And Media Metrics
 */
const withDocumentsAndMediaMetrics = () =>
	graphql(
		DocumentsAndMediaMetricsQuery,
		getMetricsMapper(result => result.document, metrics)
	);

export default withMetricsCard(withDocumentsAndMediaMetrics);
