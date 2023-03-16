import getAudienceReportMapper from 'cerebro-shared/hocs/mappers/audience-report';
import TouchpointMetricsQuery from 'shared/queries/TouchpointMetricsQuery';
import {graphql} from '@apollo/react-hoc';
import {Routes} from 'shared/util/router';
import {withAudienceReportCard} from 'shared/hoc/AudienceReportCard';

const withTouchpointAudienceReport = () =>
	graphql(TouchpointMetricsQuery, {
		...getAudienceReportMapper(
			result => result.page.viewsMetric,
			Routes.SITES_TOUCHPOINTS_KNOWN_INDIVIDUALS
		)
	});

export default withAudienceReportCard(withTouchpointAudienceReport);
