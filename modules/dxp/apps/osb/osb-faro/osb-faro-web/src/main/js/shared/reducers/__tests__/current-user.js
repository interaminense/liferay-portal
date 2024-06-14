import reducer from '../current-user';
import {cleanup} from '@testing-library/react';
import {RemoteData} from 'shared/util/records';
import {actionTypes as userActionTypes} from 'shared/actions/users';

describe('currentUser reducer', () => {
	afterEach(cleanup);

	it('should set current user id', () => {
		const id = 1234;

		const action = {
			payload: {
				result: id
			},
			type: userActionTypes.FETCH_CURRENT_USER_SUCCESS
		};

		const state = reducer(new RemoteData(), action);

		expect(state.data).toBe(String(id));
	});
});
