import * as API from 'shared/api';
import mockStore from 'test/mock-store';
import React from 'react';
import {act, cleanup, render, screen} from '@testing-library/react';
import {ChannelContext} from 'shared/context/channel';
import {mockChannelContext} from 'test/mock-channel-context';
import {mockSegment} from 'test/data';
import {Provider} from 'react-redux';
import {SegmentProfileRoutes} from '../ProfileRoutes';
import {withDataRouter} from 'test/mock-router';

jest.unmock('react-dom');

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		channelId: '123',
		groupId: '23',
		id: 'test'
	})
}));

describe('SegmentProfileRoutes', () => {
	beforeEach(() => {
		API.individualSegment.fetch.mockResolvedValue(
			mockSegment(0, {
				criteriaString:
					"(demographics/middleName/value eq 'additionalName')"
			})
		);
	});

	afterEach(cleanup);

	it('should render', async () => {
		render(
			<Provider store={mockStore()}>
				<ChannelContext.Provider value={mockChannelContext()}>
					{withDataRouter(<SegmentProfileRoutes />)}
				</ChannelContext.Provider>
			</Provider>
		);

		await act(async () => {
			await jest.runAllTimersAsync();
		});

		expect(screen.getAllByText('Seattle0').length).toBeGreaterThan(0);
	});
});
