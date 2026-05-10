import ConfigureCSV from '../ConfigureCSV';
import mockStore from 'test/mock-store';
import React from 'react';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {withDataRouter} from 'test/mock-router';

jest.unmock('react-dom');

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		channelId: '456',
		groupId: '2000'
	})
}));

describe('ConfigureCSV', () => {
	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				{withDataRouter(<ConfigureCSV groupId='23' id='123' />)}
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
