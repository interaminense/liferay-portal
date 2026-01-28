import ConfigureCSV from '../ConfigureCSV';
import mockStore from 'test/mock-store';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({
		channelId: '456',
		groupId: '2000'
	})
}));

describe('ConfigureCSV', () => {
	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<ConfigureCSV groupId='23' id='123' />
				</BrowserRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
