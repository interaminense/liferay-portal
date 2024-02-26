import {close, closeAll, open} from '../useModal';
import {isFSA} from 'flux-standard-action';
import {Modal} from 'sared/types/Modal';

describe('Modal Actions', () => {
	describe('open', () => {
		it('should return an action', () => {
			const action = open();

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe(Modal.actionTypes.OPEN_MODAL);
		});

		it('should contain modal type and props', () => {
			const action = open('Foo', {hidden: true});

			expect(action.payload.props.hidden).toBe(true);
			expect(action.payload.type).toBe('Foo');
		});
	});

	describe('close', () => {
		it('should return an action', () => {
			const action = close();

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe(Modal.actionTypes.CLOSE_MODAL);
		});
	});

	describe('closeAll', () => {
		it('should return an action', () => {
			const action = closeAll();

			expect(isFSA(action)).toBe(true);
			expect(action.type).toBe(Modal.actionTypes.CLOSE_ALL_MODALS);
		});
	});
});
