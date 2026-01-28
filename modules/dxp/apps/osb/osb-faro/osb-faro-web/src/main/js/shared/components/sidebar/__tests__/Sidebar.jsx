import mockStore from 'test/mock-store';
import React from 'react';
import Sidebar from '../index';
import {BrowserRouter} from 'react-router';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {User} from 'shared/util/records';

const defaultProps = {
	activePathname: '',
	channelId: '123',
	currentUser: new User({emailAddress: 'test@test.com', name: 'Test Test'}),
	groupId: '23'
};

jest.unmock('react-dom');

describe('Sidebar', () => {
	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<Sidebar {...defaultProps} />
				</BrowserRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render as collapsed', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<Sidebar {...defaultProps} collapsed />
				</BrowserRouter>
			</Provider>
		);

		expect(container.querySelector('.sidebar-root')).toHaveClass(
			'collapsed'
		);
	});

	it('should render with a specific sidebar id active', () => {
		const activePathName = '/workspace/23/123/contacts/individuals';

		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<Sidebar
						{...defaultProps}
						activePathname={activePathName}
					/>
				</BrowserRouter>
			</Provider>
		);

		expect(
			container.querySelector('.sidebar-item-root.active').firstChild
		).toHaveAttribute('href', activePathName);
	});
});
