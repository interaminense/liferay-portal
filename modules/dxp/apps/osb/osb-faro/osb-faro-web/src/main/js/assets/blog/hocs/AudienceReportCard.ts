import BlogMetricsQuery from 'shared/queries/BlogMetricsQuery';
import getAudienceReportMapper from 'cerebro-shared/hocs/mappers/audience-report';
import {graphql} from '@apollo/react-hoc';
import {Routes} from 'shared/util/router';
import {withAudienceReportCard} from 'shared/hoc/AudienceReportCard';

const withBlogsAudienceReport = () =>
	graphql(BlogMetricsQuery, {
		...getAudienceReportMapper(
			result => result.blog.viewsMetric,
			Routes.ASSETS_BLOGS_KNOWN_INDIVIDUALS
		)
	});

export default withAudienceReportCard(withBlogsAudienceReport);
