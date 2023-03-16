import DocumentsAndMediaMetricsQuery from 'shared/queries/DocumentsAndMediaMetricsQuery';
import getLocationsMapper, {
	getLocationsMapperCountries
} from 'cerebro-shared/hocs/mappers/locations';
import URLConstants from 'shared/util/url-constants';
import {graphql} from '@apollo/react-hoc';
import {withLocationsCard} from 'cerebro-shared/hocs/LocationsCard';

/**
 * HOC
 * @description Documents And Media Locations
 */
const withBlogsLocations = () =>
	graphql(
		DocumentsAndMediaMetricsQuery,
		getLocationsMapper(result => result.document.downloadsMetric)
	);

/**
 * HOC
 * @description Documents And Media Countries
 */
const withBlogsLocationsCountries = () =>
	graphql(
		DocumentsAndMediaMetricsQuery,
		getLocationsMapperCountries(result => result.document.downloadsMetric)
	);

export default withLocationsCard(
	withBlogsLocations,
	withBlogsLocationsCountries,
	{
		documentationTitle: Liferay.Language.get(
			'learn-more-about-downloads-by-location'
		),
		documentationUrl:
			URLConstants.SitesDashboardDocumentsAndMediaDownloadByLocation,
		title: Liferay.Language.get(
			'there-are-no-downloads-on-the-selected-period'
		)
	}
);
