import client from 'shared/apollo/client';
import mockStore from 'test/mock-store';
import React from 'react';
import RecommendationStepCard from '../index';
import {ApolloProvider} from '@apollo/client';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {withDataRouter} from 'test/mock-router';

jest.unmock('react-dom');

describe('RecommendationStepCard', () => {
	it('should render', () => {
		const {container} = render(
			<ApolloProvider client={client}>
				<Provider store={mockStore()}>
					{withDataRouter(
						<RecommendationStepCard
							router={{params: {groupId: '123'}}}
						/>
					)}
				</Provider>
			</ApolloProvider>
		);

		expect(container).toMatchSnapshot();
	});
});
