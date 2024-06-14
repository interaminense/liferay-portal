import * as actions from '../sidebar';
import {cleanup} from '@testing-library/react';
import {isFSA} from 'flux-standard-action';

describe('Sidebar Actions', () => {
	afterEach(cleanup);

	describe('collapseSidebar', () => {
		afterEach(cleanup);

		it('should return an action', () => {
			const action = actions.collapseSidebar();

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe(actions.actionTypes.COLLAPSE_SIDEBAR);
		});
	});
});
