import * as data from 'test/data';
import siteMetrics from '../../metrics';
import {getMetricsMapper} from '../metrics';

const mockData = {
	site: {
		anonymousVisitorsMetric: data.mockMetricFragment(10),
		bounceRateMetric: data.mockMetricFragment(10),
		engagementMetric: data.mockMetricFragment(10),
		knownVisitorsMetric: data.mockMetricFragment(10),
		sessionDurationMetric: data.mockMetricFragment(10),
		sessionsPerVisitorMetric: data.mockMetricFragment(10),
		visitorsMetric: data.mockMetricFragment(10)
	}
};

describe('Site Metrics Mapper', () => {
	const mapper = getMetricsMapper(result => result.site, siteMetrics);

	it('should map site metrics props to options', () => {
		const mockProps = {
			rangeSelectors: {rangeKey: '30'},
			router: {params: {channelId: 'foochannelId'}}
		};

		expect(mapper.options(mockProps)).toEqual(
			expect.objectContaining({
				variables: {
					channelId: mockProps.router.params.channelId,
					rangeEnd: null,
					rangeKey: parseInt(mockProps.rangeSelectors.rangeKey),
					rangeStart: null
				}
			})
		);
	});

	it('should map site metrics results to props', () => {
		expect(
			mapper.props({
				data: mockData,
				ownProps: {
					rangeKey: 30
				}
			})
		).toEqual(expect.objectContaining({items: expect.any(Array)}));
	});
});
