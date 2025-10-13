import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import {Account} from 'shared/util/records';
import {AccountProfileRoutes} from '../ProfileRoutes';
import {AppContext} from 'AppContext';
import {BrowserRouter} from 'react-router-dom';
import {cleanup, render} from '@testing-library/react';
import {mockChannel} from './data';

import {Provider} from 'react-redux';

export const mockChannelContext = () => ({
	channelDispatch: jest.fn(() => null),
	channels: [mockChannel(1), mockChannel(2)],
	selectedChannel: mockChannel()
});

const defaultProps = {
	account: data.getImmutableMock(Account, data.mockAccount),
	channelId: '123',
	groupId: '23',
	id: 'test',
	location: {pathname: ''}
};

jest.unmock('react-dom');

describe('AccountProfileRoutes', () => {
	afterEach(cleanup);

	beforeAll(() => {
		delete window.location;
	});

	it('should render', () => {
		window.location = {pathname: '/'};

		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<AppContext.Provider value={mockChannelContext()}>
						<AccountProfileRoutes {...defaultProps} />
					</AppContext.Provider>
				</BrowserRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
