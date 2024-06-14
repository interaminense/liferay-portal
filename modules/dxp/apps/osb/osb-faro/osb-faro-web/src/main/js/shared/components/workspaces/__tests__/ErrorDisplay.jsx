import mockStore from 'test/mock-store';
import React from 'react';
import WorkspacesErrorDisplay from '../ErrorDisplay';
import {BrowserRouter} from 'react-router-dom';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';
import {User} from 'shared/util/records';

jest.unmock('react-dom');

describe('WorkspacesErrorDisplay', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<WorkspacesErrorDisplay
						currentUser={
							new User({emailAddress: 'test@liferay.com'})
						}
					/>
				</BrowserRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
