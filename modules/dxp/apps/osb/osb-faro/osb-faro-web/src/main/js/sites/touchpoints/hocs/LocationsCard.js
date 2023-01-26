import getLocationsMapper, {
	getLocationsMapperCountries
} from 'cerebro-shared/hocs/mappers/locations';
import TouchpointMetricsQuery from 'shared/queries/TouchpointMetricsQuery';
import URLConstants from 'shared/util/url-constants';
import {graphql} from '@apollo/react-hoc';
import {withLocationsCard} from 'cerebro-shared/hocs/LocationsCard';

/**
 * HOC
 * @description Touchpoint Locations
 */
const withTouchpointLocations = () =>
	graphql(
		TouchpointMetricsQuery,
		getLocationsMapper(result => result.page.viewsMetric)
	);

/**
 * HOC
 * @description Touchpoint Countries
 */
const withTouchpointsLocationsCountries = () =>
	graphql(
		TouchpointMetricsQuery,
		getLocationsMapperCountries(result => result.page.viewsMetric)
	);

export default withLocationsCard(
	withTouchpointLocations,
	withTouchpointsLocationsCountries,
	{
		documentationTitle: Liferay.Language.get(
			'learn-more-about-views-by-location'
		),
		documentationUrl: URLConstants.SitesDashboardPagesViewsByLocation,
		title: Liferay.Language.get('there-are-no-views-on-the-selected-period')
	}
);
