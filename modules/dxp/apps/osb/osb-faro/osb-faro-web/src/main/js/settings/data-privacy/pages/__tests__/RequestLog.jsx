import client from 'shared/apollo/client';
import mockStore from 'test/mock-store';
import React from 'react';
import RequestLog from '../RequestLog';
import {ApolloProvider} from '@apollo/react-components';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

jest.mock('shared/hooks/useTimeZone', () => ({
	useTimeZone: () => ({
		timeZoneId: 'UTC'
	})
}));

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({
		groupId: '23'
	})
}));

describe('RequestLog', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<ApolloProvider client={client}>
				<Provider store={mockStore()}>
					<BrowserRouter>
						<RequestLog
							router={{params: {groupId: '23'}, query: {}}}
						/>
					</BrowserRouter>
				</Provider>
			</ApolloProvider>
		);

		jest.runAllTimers();

		expect(container).toMatchSnapshot();
	});
});
