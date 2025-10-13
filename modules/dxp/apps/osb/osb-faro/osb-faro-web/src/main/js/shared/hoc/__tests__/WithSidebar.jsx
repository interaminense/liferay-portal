import mockStore from 'test/mock-store';
import React from 'react';
import withSidebar from '../WithSidebar';
import {AppContext} from '../../../AppContext';
import {BrowserRouter} from 'react-router-dom';
import {cleanup, render} from '@testing-library/react';
import {compose} from 'redux';
import {mockChannel} from './data';
import {Provider} from 'react-redux';
import {waitForLoadingToBeRemoved} from 'test/helpers';
import {withStaticRouter} from 'test/mock-router';

jest.unmock('react-dom');

const mockChannelContext = () => ({
	channels: [mockChannel(1), mockChannel(2)],
	selectedChannel: mockChannel(),
	setSelectedChannel: jest.fn(() => null)
});

const withChannelProvider = props => Component => (
	<AppContext.Provider value={mockChannelContext()}>
		<Component {...props} />
	</AppContext.Provider>
);

describe('withSidebar', () => {
	afterEach(cleanup);
	it('should render loading', () => {
		const WrappedComponent = withSidebar(() => <div>{'foobar'}</div>);

		const {container} = render(
			<Provider store={mockStore()}>
				<AppContext.Provider value={mockChannelContext()}>
					<BrowserRouter>
						<WrappedComponent />
					</BrowserRouter>
				</AppContext.Provider>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render with the sidebar', async () => {
		const WrappedComponent = compose(
			withChannelProvider,
			withStaticRouter,
			withSidebar
		)(() => <p>{'bizbaz'}</p>);

		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<WrappedComponent
						groupId='23'
						location={{pathname: 'foo'}}
					/>
				</BrowserRouter>
			</Provider>
		);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});
