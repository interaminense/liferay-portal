import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import {AppContext} from '../../../AppContext';
import {BrowserRouter} from 'react-router-dom';
import {cleanup, render} from '@testing-library/react';
import {mockChannel} from './data';
import {Provider} from 'react-redux';
import {Segment} from 'shared/util/records';

import {SegmentProfileRoutes} from '../ProfileRoutes';

export const mockChannelContext = () => ({
	channelDispatch: jest.fn(() => null),
	channels: [mockChannel(1), mockChannel(2)],
	selectedChannel: mockChannel()
});

const defaultProps = {
	channelId: '123',
	groupId: '23',
	id: 'test',
	location: {pathname: ''},
	segment: data.getImmutableMock(Segment, data.mockSegment)
};

jest.unmock('react-dom');

describe('SegmentProfileRoutes', () => {
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
						<SegmentProfileRoutes {...defaultProps} />
					</AppContext.Provider>
				</BrowserRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
