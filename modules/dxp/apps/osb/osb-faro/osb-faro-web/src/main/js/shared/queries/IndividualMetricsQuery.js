import {gql} from 'apollo-boost';
import {TREND_FRAGMENT} from 'shared/queries/fragments';

export default gql`
	query IndividualMetrics(
		$channelId: String!
		$interval: String!
		$rangeKey: Int!
	) {
		individualMetric(
			channelId: $channelId
			interval: $interval
			rangeKey: $rangeKey
		) {
			anonymousIndividualsMetric {
				...trendFragment
			}
			knownIndividualsMetric {
				...trendFragment
			}
			totalIndividualsMetric {
				...trendFragment
			}
		}
	}

	${TREND_FRAGMENT}
`;
