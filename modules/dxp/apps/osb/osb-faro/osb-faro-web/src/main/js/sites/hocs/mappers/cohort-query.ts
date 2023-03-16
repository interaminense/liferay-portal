import {safeResultToProps} from 'shared/util/mappers';

const mapResultToProps: object = safeResultToProps(
	({
		site: {anonymousVisitorsMetric, knownVisitorsMetric, visitorsMetric}
	}) => ({
		data: {
			anonymousVisitors: {
				items: anonymousVisitorsMetric.cohortHeatMap
			},
			knownVisitors: {
				items: knownVisitorsMetric.cohortHeatMap
			},
			visitors: {
				items: visitorsMetric.cohortHeatMap
			}
		},
		empty: [
			anonymousVisitorsMetric,
			knownVisitorsMetric,
			visitorsMetric
		].some(({cohortHeatMap}) => !cohortHeatMap.length)
	})
);

const mapPropsToOptions: object = ({channelId, interval}) => ({
	variables: {
		channelId,
		interval
	}
});

export {mapPropsToOptions, mapResultToProps};
