import FormMetricsQuery from 'shared/queries/FormMetricsQuery';
import getAudienceReportMapper from 'cerebro-shared/hocs/mappers/audience-report';
import {graphql} from '@apollo/react-hoc';
import {Routes} from 'shared/util/router';
import {withAudienceReportCard} from 'shared/hoc/AudienceReportCard';

const withFormsAudienceReport = () =>
	graphql(FormMetricsQuery, {
		...getAudienceReportMapper(
			result => result.form.submissionsMetric,
			Routes.ASSETS_FORMS_KNOWN_INDIVIDUALS
		)
	});

export default withAudienceReportCard(withFormsAudienceReport);
