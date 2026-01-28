import * as data from 'test/data';
import KnownIndividuals from '../KnownIndividuals';
import mockStore from 'test/mock-store';
import React from 'react';
import {Account} from 'shared/util/records';
import {BrowserRouter} from 'react-router';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.unmock('react-dom');

describe('KnownIndividuals', () => {
	it('should render', async () => {
		const {container} = render(
			<BrowserRouter>
				<Provider store={mockStore()}>
					<KnownIndividuals
						account={data.getImmutableMock(
							Account,
							data.mockAccount
						)}
						channelId='123123'
						groupId='23'
						id='test'
					/>
				</Provider>
			</BrowserRouter>
		);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});
