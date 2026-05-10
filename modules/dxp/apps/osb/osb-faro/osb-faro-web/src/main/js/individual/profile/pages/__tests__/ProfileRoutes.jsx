import * as data from 'test/data';
import IndividualProfileRoutes from '../ProfileRoutes';
import mockStore from 'test/mock-store';
import React from 'react';
import {ChannelContext} from 'shared/context/channel';
import {cleanup, render} from '@testing-library/react';
import {Individual} from 'shared/util/records';
import {mockChannelContext} from 'test/mock-channel-context';
import {Provider} from 'react-redux';
import {withDataRouter} from 'test/mock-router';

const defaultProps = {
	channelId: '123',
	groupId: '23',
	id: 'test',
	individual: data.getImmutableMock(Individual, data.mockIndividual),
	location: {pathname: ''}
};

jest.unmock('react-dom');

describe('IndividualProfileRoutes', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<ChannelContext.Provider value={mockChannelContext()}>
					{withDataRouter(
						<IndividualProfileRoutes {...defaultProps} />
					)}
				</ChannelContext.Provider>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
