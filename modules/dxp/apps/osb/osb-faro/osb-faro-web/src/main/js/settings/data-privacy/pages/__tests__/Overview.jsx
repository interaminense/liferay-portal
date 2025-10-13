import client from 'shared/apollo/client';
import mockStore from 'test/mock-store';
import React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import {AppContext} from '../../../../AppContext';
import {cleanup, fireEvent, render} from '@testing-library/react';
import {Overview} from '../Overview';
import {Provider} from 'react-redux';
import {StaticRouter} from 'react-router-dom';

jest.unmock('react-dom');

describe('Data Privacy Overview', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container, getByText} = render(
			<ApolloProvider client={client}>
				<AppContext.Provider
					value={{currentUser: {isAdmin: () => true}}}
				>
					<Provider store={mockStore()}>
						<StaticRouter>
							<Overview groupId='23' />
						</StaticRouter>
					</Provider>
				</AppContext.Provider>
			</ApolloProvider>
		);

		jest.runAllTimers();

		fireEvent.click(getByText('Select an option'));

		expect(getByText('7 Months')).toBeTruthy();
		expect(getByText('13 Months')).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it('should render with disabled buttons in the Suppressed Users section if the user is not an AC admin', () => {
		const {getByTestId} = render(
			<ApolloProvider client={client}>
				<AppContext.Provider
					value={{currentUser: {isAdmin: () => true}}}
				>
					<Provider store={mockStore()}>
						<StaticRouter>
							<Overview groupId='23' />
						</StaticRouter>
					</Provider>
				</AppContext.Provider>
			</ApolloProvider>
		);

		jest.runAllTimers();

		expect(getByTestId('export-suppressed-user-button').disabled).toBe(
			true
		);
		expect(getByTestId('data-retention-period-select-input').disabled).toBe(
			true
		);
	});
});
