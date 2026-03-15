import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import TimeZoneSelectionModal from '../TimeZoneSelectionModal';
import {BrowserRouter} from 'react-router';
import {mockGetDateNow} from 'test/mock-date';
import {Provider} from 'react-redux';
import {render, waitFor} from '@testing-library/react';

jest.unmock('react-dom');

describe('TimeZoneSelectionModal', () => {
	mockGetDateNow(data.getTimestamp(0));

	it('should render', async () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<TimeZoneSelectionModal groupId={23} />
				</BrowserRouter>
			</Provider>
		);

		jest.runAllTimers();

		await waitFor(() => {});

		expect(container).toMatchSnapshot();
	});
});
