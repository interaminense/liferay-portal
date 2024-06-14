import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {CSV} from '../CSV';
import {DataSource, User} from 'shared/util/records';
import {Provider} from 'react-redux';
import {StaticRouter} from 'react-router';
import {UserRoleNames} from 'shared/util/constants';

jest.unmock('react-dom');

const DefaultComponent = props => (
	<Provider store={mockStore()}>
		<StaticRouter>
			<CSV
				currentUser={new User(data.mockUser())}
				dataSource={new DataSource(data.mockCSVDataSource())}
				groupId='23'
				id='test'
				{...props}
			/>
		</StaticRouter>
	</Provider>
);

describe('CSV', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container, queryByText} = render(<DefaultComponent />);

		expect(queryByText(/Edit CSV/)).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it('should not render an Edit CSV Configuration button if the user role is member', () => {
		const {queryByText} = render(
			<DefaultComponent
				currentUser={
					new User(data.mockUser(0, {roleName: UserRoleNames.Member}))
				}
			/>
		);

		expect(queryByText(/Edit CSV/)).toBeNull();
	});
});
