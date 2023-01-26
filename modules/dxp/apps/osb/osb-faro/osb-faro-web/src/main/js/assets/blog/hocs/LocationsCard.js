import BlogMetricsQuery from 'shared/queries/BlogMetricsQuery';
import getLocationsMapper, {
	getLocationsMapperCountries
} from 'cerebro-shared/hocs/mappers/locations';
import URLConstants from 'shared/util/url-constants';
import {graphql} from '@apollo/react-hoc';
import {withLocationsCard} from 'cerebro-shared/hocs/LocationsCard';

/**
 * HOC
 * @description Blogs Locations
 */
const withBlogsLocations = () =>
	graphql(
		BlogMetricsQuery,
		getLocationsMapper(result => result.blog.viewsMetric)
	);

/**
 * HOC
 * @description Blogs Countries
 */
const withBlogsLocationsCountries = () =>
	graphql(
		BlogMetricsQuery,
		getLocationsMapperCountries(result => result.blog.viewsMetric)
	);

export default withLocationsCard(
	withBlogsLocations,
	withBlogsLocationsCountries,
	{
		documentationTitle: Liferay.Language.get(
			'learn-more-about-views-by-location'
		),
		documentationUrl: URLConstants.SitesDashboardBlogsViewsByLocation,
		title: Liferay.Language.get('there-are-no-views-on-the-selected-period')
	}
);
