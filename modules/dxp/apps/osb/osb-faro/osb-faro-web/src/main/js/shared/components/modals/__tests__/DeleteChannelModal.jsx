import * as API from 'shared/api';
import DeleteChannelModal from '../DeleteChannelModal';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';
import {noop} from 'lodash';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.unmock('react-dom');

describe('DeleteChannelModal', () => {
	afterEach(cleanup);

	it('renders without data source alert message', async () => {
		API.dataSource.fetchChannels.mockReturnValueOnce(
			Promise.resolve({items: [], total: 0})
		);

		const {container} = render(
			<BrowserRouter>
				<DeleteChannelModal onClose={noop} onSubmit={noop} />
			</BrowserRouter>
		);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});

	it('should render with data source alert message', async () => {
		const {container, getByText} = render(
			<BrowserRouter>
				<DeleteChannelModal onClose={noop} onSubmit={noop} />
			</BrowserRouter>
		);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(getByText(/To reconnect to Analytics Cloud/)).toBeTruthy();
	});
});
