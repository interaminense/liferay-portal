import InviteUsersModal from '../InviteUsersModal';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {noop} from 'lodash';

jest.unmock('react-dom');

describe('InviteUsersModal', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<InviteUsersModal onClose={noop} />);

		expect(container).toMatchSnapshot();
	});

	it('should render with custom class', () => {
		const {container} = render(
			<InviteUsersModal className='custom-class' onClose={noop} />
		);

		expect(container.querySelector('.custom-class')).toBeTruthy();
	});
});
