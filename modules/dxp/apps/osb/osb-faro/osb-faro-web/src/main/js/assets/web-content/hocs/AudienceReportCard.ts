import getAudienceReportMapper from 'cerebro-shared/hocs/mappers/audience-report';
import WebContentMetricsQuery from 'shared/queries/WebContentMetricsQuery';
import {graphql} from '@apollo/react-hoc';
import {Routes} from 'shared/util/router';
import {withAudienceReportCard} from 'shared/hoc/AudienceReportCard';

const withWebContentAudienceReport = () =>
	graphql(WebContentMetricsQuery, {
		...getAudienceReportMapper(
			result => result.journal.viewsMetric,
			Routes.ASSETS_WEB_CONTENT_KNOWN_INDIVIDUALS
		)
	});

export default withAudienceReportCard(withWebContentAudienceReport);
