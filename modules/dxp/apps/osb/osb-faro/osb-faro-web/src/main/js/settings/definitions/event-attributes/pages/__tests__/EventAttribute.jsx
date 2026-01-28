import Events from '../EventAttributes';
import mockStore from 'test/mock-store';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({
		groupId: '23'
	})
}));

describe('EventAttributes', () => {
	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<Events groupId='23' />
				</BrowserRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
