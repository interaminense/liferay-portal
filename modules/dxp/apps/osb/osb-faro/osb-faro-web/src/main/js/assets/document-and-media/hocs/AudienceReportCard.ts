import DocumentsAndMediaMetricsQuery from 'shared/queries/DocumentsAndMediaMetricsQuery';
import getAudienceReportMapper from 'cerebro-shared/hocs/mappers/audience-report';
import {graphql} from '@apollo/react-hoc';
import {Routes} from 'shared/util/router';
import {withAudienceReportCard} from 'shared/hoc/AudienceReportCard';

const withDocumentsAndMediaAudienceReport = () =>
	graphql(DocumentsAndMediaMetricsQuery, {
		...getAudienceReportMapper(
			result => result.document.downloadsMetric,
			Routes.ASSETS_DOCUMENTS_AND_MEDIA_KNOWN_INDIVIDUALS
		)
	});

export default withAudienceReportCard(withDocumentsAndMediaAudienceReport);
