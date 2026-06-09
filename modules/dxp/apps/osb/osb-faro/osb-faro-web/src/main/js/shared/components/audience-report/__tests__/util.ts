import {formatData} from '../util';

describe('audience-report util', () => {
	describe('formatData', () => {
		// Apollo Client 3 freezes query results in development, so any
		// in-place mutation of the data (such as Array.prototype.sort) throws
		// "Cannot assign to read only property". formatData must not mutate
		// the metrics array it receives.
		it('does not mutate a frozen metrics array', () => {
			const metrics = Object.freeze([
				{value: 1, valueKey: 'segment-a'},
				{value: 5, valueKey: 'segment-b'},
				{value: 3, valueKey: 'others'}
			]);

			const run = () =>
				formatData({
					audienceReport: {
						anonymousUsersCount: 10,
						knownUsersCount: 20,
						nonsegmentedKnownUsersCount: 5,
						segmentedAnonymousUsersCount: 4,
						segmentedKnownUsersCount: 15
					},
					segment: {metrics, total: 100}
				});

			expect(run).not.toThrow();
		});
	});
});
