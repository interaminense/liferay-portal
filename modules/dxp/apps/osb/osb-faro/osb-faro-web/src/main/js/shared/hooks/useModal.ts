import {Modal} from 'shared/types';
import {useDispatch} from 'react-redux';

export const close = () => ({
	type: Modal.actionTypes.CLOSE_MODAL
});

export const closeAll = () => ({
	type: Modal.actionTypes.CLOSE_ALL_MODALS
});

export const open = (
	type,
	props: {[key: string]: any} = {},
	options: {closeOnBlur?: boolean} = {}
) => {
	const {closeOnBlur = true} = options;

	return {
		payload: {
			closeOnBlur,
			props,
			type
		},
		type: Modal.actionTypes.OPEN_MODAL
	};
};

export const useModal = () => {
	const dispatch = useDispatch();

	const closeModal = () => {
		dispatch(close());
	};

	const closeAllModals = () => {
		dispatch(closeAll());
	};

	const openModal = (type, props = {}, options = {}) => {
		dispatch(open(type, props, options));
	};

	return {close: closeModal, closeAll: closeAllModals, open: openModal};
};
