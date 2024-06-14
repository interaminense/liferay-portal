import {cleanup} from '@testing-library/react';
import {fetchAccount} from '../accounts';
import {isFSA} from 'flux-standard-action';

describe('Accounts', () => {
	afterEach(cleanup);

	describe('fetchAccount', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = fetchAccount('123');

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe('NO_OP');
		});
	});
});
