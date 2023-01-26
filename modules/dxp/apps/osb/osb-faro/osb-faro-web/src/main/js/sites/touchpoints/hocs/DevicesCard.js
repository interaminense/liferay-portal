import getDevicesMapper from 'cerebro-shared/hocs/mappers/devices';
import TouchpointMetricsQuery from 'shared/queries/TouchpointMetricsQuery';
import URLConstants from 'shared/util/url-constants';
import {graphql} from '@apollo/react-hoc';
import {withDevicesCard} from 'shared/hoc/DevicesCard';

/**
 * HOC
 * @description Touchpoint Devices
 */
const withTouchpointDevices = () =>
	graphql(
		TouchpointMetricsQuery,
		getDevicesMapper(result => result.page.viewsMetric)
	);

export default withDevicesCard(withTouchpointDevices, {
	documentationTitle: Liferay.Language.get(
		'learn-more-about-views-by-technology'
	),
	documentationUrl: URLConstants.SitesDashboardPagesViewsByTechnology,
	title: Liferay.Language.get('there-are-no-views-on-the-selected-period')
});
