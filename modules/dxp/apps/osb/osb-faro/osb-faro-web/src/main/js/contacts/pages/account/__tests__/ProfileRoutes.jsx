import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import {Account} from 'shared/util/records';
import {AccountProfileRoutes} from '../ProfileRoutes';
import {ChannelContext} from 'shared/context/channel';
import {cleanup, render} from '@testing-library/react';
import {mockChannelContext} from 'test/mock-channel-context';
import {Provider} from 'react-redux';
import {withDataRouter} from 'test/mock-router';

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

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<ChannelContext.Provider value={mockChannelContext()}>
					{withDataRouter(<AccountProfileRoutes {...defaultProps} />)}
				</ChannelContext.Provider>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
