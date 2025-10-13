import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import {AppContext} from '../../../../AppContext';
import {BrowserRouter} from 'react-router-dom';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';
import {User} from 'shared/util/records';
import {User as UserRoutes} from '../index';

jest.unmock('react-dom');

jest.mock('shared/hooks/useCurrentUser', () => ({
	useCurrentUser: jest.fn()
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		groupId: '23'
	})
}));

const DefaultComponent = props => (
	<AppContext.Provider value={props.currentUser}>
		<Provider store={mockStore()}>
			<BrowserRouter>
				<UserRoutes {...props} />
			</BrowserRouter>
		</Provider>
	</AppContext.Provider>
);

describe('UserRoutes', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<DefaultComponent currentUser={{isAdmin: () => true}} />
		);

		expect(container).toMatchSnapshot();
	});

	it('if the user is AC Admin, then the tabs for toggling between users and user requests should render', () => {
		const {queryAllByText, queryByText} = render(
			<DefaultComponent currentUser={{isAdmin: () => true}} />
		);

		expect(queryAllByText('Manage Users')).toBeTruthy();
		expect(queryByText('Requests')).toBeTruthy();
	});

	it('if the user is NOT an AC Admin, then the tabs for toggling between users and user requests should NOT render', () => {
		const {queryByText} = render(
			<DefaultComponent
				currentUser={data.getImmutableMock(User, {
					...data.mockMemberUser,
					isAdmin: () => false
				})}
			/>
		);

		expect(queryByText('Manager Users')).toBeNull();
		expect(queryByText('Requests')).toBeNull();
	});
});
