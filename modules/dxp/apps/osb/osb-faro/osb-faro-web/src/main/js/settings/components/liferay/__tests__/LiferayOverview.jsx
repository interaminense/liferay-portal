import * as data from 'test/data';
import LiferayOverview from '../LiferayOverview';
import mockStore from 'test/mock-store';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';
import {DataSource} from 'shared/util/records';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({
		groupId: '23',
		id: 'test'
	})
}));

jest.mock('shared/hooks/useRequest', () => ({
	useRequest: jest.fn
}));

jest.mock('shared/hooks/useCurrentUser', () => ({
	useCurrentUser: () => ({isAdmin: () => true})
}));

const defaultProps = {
	dataSource: data.getImmutableMock(DataSource, data.mockSalesforceDataSource)
};

const DefaultComponent = props => (
	<Provider store={mockStore()}>
		<BrowserRouter>
			<LiferayOverview {...defaultProps} {...props} />
		</BrowserRouter>
	</Provider>
);

describe('LiferayOverview', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<DefaultComponent />);

		expect(container).toMatchSnapshot();
	});
});
