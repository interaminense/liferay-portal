import List from '../List';
import mockStore from 'test/mock-store';
import React from 'react';
import {ChannelContext} from 'shared/context/channel';
import {cleanup, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {mockChannelContext} from 'test/mock-channel-context';
import {Provider} from 'react-redux';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.unmock('react-dom');

jest.mock('shared/hooks/useFrontendDataSet', () => ({
	useFrontendDataSet: () => {
		const FakeDataSet = ({id}: {id: string}) => (
			<div data-testid='fds-component' id={id} />
		);

		return FakeDataSet;
	}
}));

// TotalAccounts hits its own useRequest call expecting an array of metrics.
// The List test isn't about TotalAccounts, so render a stub and avoid coupling
// to that component's data shape.
jest.mock('contacts/components/account/TotalAccounts', () => () => (
	<div data-testid='total-accounts-stub' />
));

jest.mock('shared/hooks/useRequest');

jest.mock('shared/util/breadcrumbs', () => ({
	getHome: jest.fn(({label}: {label?: string} = {}) => ({
		active: false,
		label: label || 'Home'
	}))
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		channelId: '123',
		groupId: '23'
	})
}));

const store = mockStore();

const renderList = ({queryString = ''}: {queryString?: string} = {}) =>
	render(
		<Provider store={store}>
			<ChannelContext.Provider value={mockChannelContext() as any}>
				<MemoryRouter
					initialEntries={[
						`/workspace/23/123/accounts${queryString}`
					]}
				>
					<List channelId='123' groupId='23' />
				</MemoryRouter>
			</ChannelContext.Provider>
		</Provider>
	);

describe('List', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		const useRequest = require('shared/hooks/useRequest');
		useRequest.useRequest = jest.fn(() => ({
			data: {
				total: 1
			}
		}));
	});

	afterEach(cleanup);

	describe('rendering', () => {
		it('should render without crashing', () => {
			const {container} = renderList();

			expect(container).toBeInTheDocument();
		});

		it('should render the page title "Accounts"', () => {
			renderList();

			expect(screen.getByText('Accounts')).toBeInTheDocument();
		});

		it('should render the empty state when there are no data sources connected', () => {
			const useRequest = require('shared/hooks/useRequest');

			useRequest.useRequest.mockReturnValue({
				data: {
					total: 0
				}
			});

			renderList();
		});

		it('should render the FrontendDataSet component', () => {
			renderList();

			expect(screen.getByTestId('fds-component')).toBeInTheDocument();
		});

		it('should render the FrontendDataSet with id "accounts-list-dataset"', () => {
			renderList();

			expect(screen.getByTestId('fds-component')).toHaveAttribute('id');
		});

		it('should match the snapshot', async () => {
			const {container} = renderList();

			await waitForLoadingToBeRemoved();

			expect(container).toMatchSnapshot();
		});
	});
});
