import client from 'shared/apollo/client';
import DateFilter from '../DateFilter';
import mockStore from 'test/mock-store';
import React from 'react';
import {ApolloProvider} from '@apollo/client/react';
import {MockedProvider} from '@apollo/client/testing/react';
import {mockPreferenceReq} from 'test/graphql-data';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

describe('DateFilter', () => {
	it('should render', () => {
		const {container} = render(
			<ApolloProvider client={client}>
				<Provider store={mockStore()}>
					<MockedProvider mocks={[mockPreferenceReq()]}>
						<DateFilter onSubmit={jest.fn()} />
					</MockedProvider>
				</Provider>
			</ApolloProvider>
		);

		expect(container).toMatchSnapshot();
	});
});
