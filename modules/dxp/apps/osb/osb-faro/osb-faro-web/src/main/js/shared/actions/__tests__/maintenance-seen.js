import * as actions from '../maintenance-seen';
import {cleanup} from '@testing-library/react';
import {isFSA} from 'flux-standard-action';

describe('Maintenance Seen Actions', () => {
	afterEach(cleanup);

	describe('setMaintenanceSeen', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = actions.setMaintenanceSeen();

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe(actions.actionTypes.SET_MAINTENANCE_SEEN);
		});
	});
});
