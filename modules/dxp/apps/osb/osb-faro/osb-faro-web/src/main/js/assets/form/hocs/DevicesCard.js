import FormMetricsQuery from 'shared/queries/FormMetricsQuery';
import getDevicesMapper from 'cerebro-shared/hocs/mappers/devices';
import URLConstants from 'shared/util/url-constants';
import {graphql} from '@apollo/react-hoc';
import {withDevicesCard} from 'shared/hoc/DevicesCard';

/**
 * HOC
 * @description Forms Devices
 */
const withFormsDevices = () =>
	graphql(
		FormMetricsQuery,
		getDevicesMapper(result => result.form.submissionsMetric)
	);

export default withDevicesCard(withFormsDevices, {
	documentationTitle: Liferay.Language.get(
		'learn-more-about-submissions-by-technology'
	),
	documentationUrl: URLConstants.SitesDashboardFormsSubmissionsByTechnology,
	title: Liferay.Language.get(
		'there-are-no-submissions-on-the-selected-period'
	)
});
