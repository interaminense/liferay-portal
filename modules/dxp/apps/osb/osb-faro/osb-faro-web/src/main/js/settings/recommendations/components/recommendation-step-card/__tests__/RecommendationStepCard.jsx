import client from 'shared/apollo/client';
import mockStore from 'test/mock-store';
import React from 'react';
import RecommendationStepCard from '../index';
import {ApolloProvider} from '@apollo/react-components';
import {BrowserRouter} from 'react-router';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

describe('RecommendationStepCard', () => {
	it('should render', () => {
		const {container} = render(
			<ApolloProvider client={client}>
				<Provider store={mockStore()}>
					<BrowserRouter>
						<RecommendationStepCard
							router={{params: {groupId: '123'}}}
						/>
					</BrowserRouter>
				</Provider>
			</ApolloProvider>
		);

		expect(container).toMatchSnapshot();
	});
});
