import mockStore from 'test/mock-store';
import React from 'react';
import TimeZoneAlert from '../TimeZoneAlert';
import {BrowserRouter} from 'react-router';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

jest.mock('shared/hooks/useTimeZone', () => ({
	useTimeZone: () => ({
		displayTimeZone: 'UTC -03:00 Brasilia Time (America/Recife)',
		timeZoneId: 'UTC'
	})
}));

describe('TimeZoneAlert', () => {
	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<TimeZoneAlert groupId='23' onClose={jest.fn()} />
				</BrowserRouter>
			</Provider>
		);
		expect(container).toMatchSnapshot();
	});
});
