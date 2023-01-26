import BlogMetricsQuery from 'shared/queries/BlogMetricsQuery';
import getDevicesMapper from 'cerebro-shared/hocs/mappers/devices';
import URLConstants from 'shared/util/url-constants';
import {graphql} from '@apollo/react-hoc';
import {withDevicesCard} from 'shared/hoc/DevicesCard';

/**
 * HOC
 * @description Blogs Devices
 */
const withBlogsDevices = () =>
	graphql(
		BlogMetricsQuery,
		getDevicesMapper(result => result.blog.viewsMetric)
	);

export default withDevicesCard(withBlogsDevices, {
	documentationTitle: Liferay.Language.get(
		'learn-more-about-views-by-technology'
	),
	documentationUrl: URLConstants.SitesDashboardBlogsViewsByTechnology,
	title: Liferay.Language.get('there-are-no-views-on-the-selected-period')
});
