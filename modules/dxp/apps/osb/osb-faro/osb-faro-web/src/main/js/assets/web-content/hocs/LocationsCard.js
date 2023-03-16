import getLocationsMapper, {
	getLocationsMapperCountries
} from 'cerebro-shared/hocs/mappers/locations';
import URLConstants from 'shared/util/url-constants';
import WebContentMetricsQuery from 'shared/queries/WebContentMetricsQuery';
import {graphql} from '@apollo/react-hoc';
import {withLocationsCard} from 'cerebro-shared/hocs/LocationsCard';

/**
 * HOC
 * @description Web Content Locations
 */
const withWebContentLocations = () =>
	graphql(
		WebContentMetricsQuery,
		getLocationsMapper(result => result.journal.viewsMetric)
	);

/**
 * HOC
 * @description Web Content Countries
 */
const withWebContentLocationsCountries = () =>
	graphql(
		WebContentMetricsQuery,
		getLocationsMapperCountries(result => result.journal.viewsMetric)
	);

export default withLocationsCard(
	withWebContentLocations,
	withWebContentLocationsCountries,
	{
		documentationTitle: Liferay.Language.get(
			'learn-more-about-views-by-location'
		),
		documentationUrl: URLConstants.SitesDashboardWebContentViewsByLocation,
		title: Liferay.Language.get('there-are-no-views-on-the-selected-period')
	}
);
