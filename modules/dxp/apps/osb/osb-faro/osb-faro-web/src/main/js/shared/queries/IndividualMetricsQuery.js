import {gql} from 'apollo-boost';

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
				value
				trend {
					percentage
				}
			}
			knownIndividualsMetric {
				value
				trend {
					percentage
				}
			}
			totalIndividualsMetric {
				value
				trend {
					percentage
				}
			}
		}
	}
`;
