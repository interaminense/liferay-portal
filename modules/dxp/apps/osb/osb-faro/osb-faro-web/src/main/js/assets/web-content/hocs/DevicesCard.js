import getDevicesMapper from 'cerebro-shared/hocs/mappers/devices';
import URLConstants from 'shared/util/url-constants';
import WebContentMetricsQuery from 'shared/queries/WebContentMetricsQuery';
import {graphql} from '@apollo/react-hoc';
import {withDevicesCard} from 'shared/hoc/DevicesCard';

/**
 * HOC
 * @description Web Content Devices
 */
const withWebContentDevices = () =>
	graphql(
		WebContentMetricsQuery,
		getDevicesMapper(result => result.journal.viewsMetric)
	);

export default withDevicesCard(withWebContentDevices, {
	documentationTitle: Liferay.Language.get(
		'learn-more-about-views-by-technology'
	),
	documentationUrl: URLConstants.SitesDashboardWebContentViewsByTechnology,
	title: Liferay.Language.get('there-are-no-views-on-the-selected-period')
});
