import DocumentsAndMediaMetricsQuery from 'shared/queries/DocumentsAndMediaMetricsQuery';
import getDevicesMapper from 'cerebro-shared/hocs/mappers/devices';
import URLConstants from 'shared/util/url-constants';
import {graphql} from '@apollo/react-hoc';
import {withDevicesCard} from 'shared/hoc/DevicesCard';

/**
 * HOC
 * @description Documents And Media Devices
 */
const withDocumentsAndMediaDevices = () =>
	graphql(
		DocumentsAndMediaMetricsQuery,
		getDevicesMapper(result => result.document.downloadsMetric)
	);

export default withDevicesCard(withDocumentsAndMediaDevices, {
	documentationTitle: Liferay.Language.get(
		'learn-more-about-downloads-by-technology'
	),
	documentationUrl:
		URLConstants.SitesDashboardDocumentsAndMediaViewsByTechnology,
	title: Liferay.Language.get('there-are-no-downloads-on-the-selected-period')
});
