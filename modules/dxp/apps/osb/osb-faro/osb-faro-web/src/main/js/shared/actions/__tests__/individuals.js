import {cleanup} from '@testing-library/react';
import {fetchIndividual} from '../individuals';
import {isFSA} from 'flux-standard-action';

describe('Individuals', () => {
	afterEach(cleanup);

	describe('fetchIndividual', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = fetchIndividual('123');

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});
});
