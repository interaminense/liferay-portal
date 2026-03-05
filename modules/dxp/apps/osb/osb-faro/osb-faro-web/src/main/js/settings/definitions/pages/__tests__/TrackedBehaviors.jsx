import mockStore from 'test/mock-store';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';
import {TrackedBehaviors} from '../TrackedBehaviors';

jest.unmock('react-dom');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({
		groupId: '23'
	})
}));

ReactDOM.createPortal = jest.fn();

describe('TrackedBehaviorsList', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<TrackedBehaviors groupId='23' />
				</BrowserRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
