import * as data from 'test/data';
import * as useDataSource from 'shared/hooks/useDataSource';
import mockStore from 'test/mock-store';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';
import {IndividualsDistribution} from '../Distribution';
import {mockEmptyState, mockSuccessState} from 'test/__mocks__/mock-objects';
import {Provider} from 'react-redux';
import {User} from 'shared/util/records';

jest.unmock('react-dom');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({
		groupId: '123'
	})
}));

const mockUseDataSource = useDataSource;

const defaultProps = {
	currentUser: new User(data.mockUser()),
	groupId: '123'
};

const WrappedComponent = () => (
	<Provider store={mockStore()}>
		<BrowserRouter>
			<IndividualsDistribution {...defaultProps} />
		</BrowserRouter>
	</Provider>
);

describe('Individuals Dashboard Distribution', () => {
	afterEach(cleanup);

	it('renders', () => {
		mockUseDataSource.useDataSource = jest.fn(() => mockSuccessState);

		const {container} = render(<WrappedComponent />);

		expect(container).toMatchSnapshot();
	});

	it('renders with data source empty state', () => {
		mockUseDataSource.useDataSource = jest.fn(() => mockEmptyState);

		const {container} = render(<WrappedComponent />);

		expect(container).toMatchSnapshot();
	});
});
