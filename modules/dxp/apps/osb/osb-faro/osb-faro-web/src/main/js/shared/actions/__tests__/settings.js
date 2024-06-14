import {cleanup} from '@testing-library/react';
import {isFSA} from 'flux-standard-action';
import {setBackURL} from '../settings';

describe('Settings Actions', () => {
	afterEach(cleanup);

	describe('setBackURL', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = setBackURL('123');

			expect(isFSA(action)).toBe(true);
		});
	});
});
