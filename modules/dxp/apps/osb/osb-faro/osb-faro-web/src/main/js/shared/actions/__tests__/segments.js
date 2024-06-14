import {cleanup} from '@testing-library/react';
import {fetchSegment} from '../segments';
import {isFSA} from 'flux-standard-action';

describe('Segments', () => {
	afterEach(cleanup);

	describe('fetchSegment', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = fetchSegment('123');

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});
});
