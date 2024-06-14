import {cleanup} from '@testing-library/react';
import {
	fetchDistribution,
	fetchIndividualsDistribution
} from '../distributions';
import {isFSA} from 'flux-standard-action';

describe('Distribution', () => {
	afterEach(cleanup);

	describe('fetchDistribution', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = fetchDistribution({});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});

	describe('fetchIndividualsDistribution', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = fetchIndividualsDistribution({});

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});
});
