import client from 'shared/apollo/client';
import InterestDetails from '../InterestDetails';
import React from 'react';
import {ApolloProvider} from '@apollo/react-components';
import {AppContext} from '../../../AppContext';
import {mockChannel} from './data';

import {render} from '@testing-library/react';
import {StaticRouter} from 'react-router-dom';

export const mockChannelContext = () => ({
	channelDispatch: jest.fn(() => null),
	channels: [mockChannel(1), mockChannel(2)],
	selectedChannel: mockChannel()
});

jest.unmock('react-dom');

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useLocation: () => ({
		search: '?rangeKey=30'
	}),
	useParams: () => ({
		channelId: '456',
		groupId: '123',
		query: {
			rangeKey: '30'
		}
	})
}));

describe('Sites Dashboard InterestDetails', () => {
	it('render', () => {
		const {container} = render(
			<ApolloProvider client={client}>
				<StaticRouter>
					<AppContext.Provider value={mockChannelContext()}>
						<InterestDetails
							channelName='Test Channel'
							router={{
								params: {channelId: '456', groupId: '123'},
								query: {rangeKey: '30'}
							}}
						/>
					</AppContext.Provider>
				</StaticRouter>
			</ApolloProvider>
		);

		expect(container).toMatchSnapshot();
	});
});
