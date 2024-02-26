import {createReducer} from 'redux-toolbox';
import {List, Map} from 'immutable';
import {Modal} from 'shared/types/Modal';

export default createReducer(new List(), {
	[Modal.actionTypes.CLOSE_ALL_MODALS](state) {
		return state.clear();
	},

	[Modal.actionTypes.CLOSE_MODAL](state) {
		return state.pop();
	},

	[Modal.actionTypes.OPEN_MODAL](state, action) {
		const {closeOnBlur, props, type} = action.payload;

		return state.push(
			new Map({
				closeOnBlur,
				props: new Map(props),
				type
			})
		);
	}
});
