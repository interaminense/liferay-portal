import {gql} from 'apollo-boost';
import {METRIC_FRAGMENT} from 'shared/queries/fragments';

export default gql`
	query SiteMetrics(
		$channelId: String
		$interval: String!
		$rangeEnd: String
		$rangeKey: Int
		$rangeStart: String
	) {
		site(
			channelId: $channelId
			interval: $interval
			rangeEnd: $rangeEnd
			rangeKey: $rangeKey
			rangeStart: $rangeStart
		) {
			anonymousVisitorsMetric {
				...metricFragment
			}
			bounceRateMetric {
				...metricFragment
			}
			knownVisitorsMetric {
				...metricFragment
			}
			sessionDurationMetric {
				...metricFragment
			}
			sessionsPerVisitorMetric {
				...metricFragment
			}
			visitorsMetric {
				...metricFragment
			}
		}
	}

	${METRIC_FRAGMENT}
`;
