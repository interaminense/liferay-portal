import * as data from 'test/data';
import client from 'shared/apollo/client';
import mockStore from 'test/mock-store';
import React from 'react';
import View from '../View';
import {ApolloProvider} from '@apollo/react-components';
import {BrowserRouter} from 'react-router';
import {MockedProvider} from '@apollo/react-testing';
import {
	mockRecommendationJobRunsReq,
	mockRecommendationReq
} from 'test/graphql-data';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {waitForLoading} from 'test/helpers';

jest.unmock('react-dom');

jest.mock('shared/hooks/useTimeZone', () => ({
	useTimeZone: () => ({
		timeZoneId: 'UTC'
	})
}));

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({
		groupId: '123',
		jobId: '321',
		query: {delta: '10', page: '1'}
	})
}));

const DefaultComponent = props => (
	<ApolloProvider client={client}>
		<Provider store={mockStore()}>
			<BrowserRouter>
				<MockedProvider
					mocks={[
						mockRecommendationJobRunsReq([
							data.mockRecommendationJobRun(0)
						]),
						mockRecommendationReq(data.mockRecommendationJob('321'))
					]}
				>
					<View
						{...props}
						router={{params: {groupId: '123', jobId: '321'}}}
					/>
				</MockedProvider>
			</BrowserRouter>
		</Provider>
	</ApolloProvider>
);

describe('View', () => {
	it('should render', async () => {
		const {container} = render(<DefaultComponent />);

		await waitForLoading(container);

		jest.runAllTimers();

		expect(container).toMatchSnapshot();
	});
});
