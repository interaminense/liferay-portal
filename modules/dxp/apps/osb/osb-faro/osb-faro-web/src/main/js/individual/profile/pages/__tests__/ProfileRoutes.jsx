import * as data from 'test/data';
import IndividualProfileRoutes from '../ProfileRoutes';
import mockStore from 'test/mock-store';
import React from 'react';
import {AppContext} from '../../../../AppContext';
import {BrowserRouter} from 'react-router-dom';
import {cleanup, render} from '@testing-library/react';
import {Individual} from 'shared/util/records';
import {mockChannel} from './data';

import {Provider} from 'react-redux';

export const mockChannelContext = () => ({
	channelDispatch: jest.fn(() => null),
	channels: [mockChannel(1), mockChannel(2)],
	selectedChannel: mockChannel()
});

const defaultProps = {
	channelId: '123',
	groupId: '23',
	id: 'test',
	individual: data.getImmutableMock(Individual, data.mockIndividual),
	location: {pathname: ''}
};

jest.unmock('react-dom');

describe('IndividualProfileRoutes', () => {
	beforeAll(() => {
		delete window.location;
	});

	afterEach(cleanup);

	it('should render', () => {
		window.location = {pathname: '/'};

		const {container} = render(
			<Provider store={mockStore()}>
				<AppContext.Provider value={mockChannelContext()}>
					<BrowserRouter>
						<IndividualProfileRoutes {...defaultProps} />
					</BrowserRouter>
				</AppContext.Provider>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
