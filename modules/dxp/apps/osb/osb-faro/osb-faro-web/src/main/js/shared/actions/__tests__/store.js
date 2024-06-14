import {actionTypes, clearStore} from '../store';
import {cleanup} from '@testing-library/react';
import {isFSA} from 'flux-standard-action';

describe('store', () => {
	afterEach(cleanup);

	describe('clearStore', () => {
		afterEach(cleanup);

		it('should return a clearStore action', () => {
			const action = clearStore();

			expect(isFSA(action)).toBeTrue();
			expect(action.type).toBe(actionTypes.CLEAR_STORE);
		});
	});
});
