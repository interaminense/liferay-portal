import client from 'shared/apollo/client';
import EventChip from '../EventChip';
import mockStore from 'test/mock-store';
import React from 'react';
import {ApolloProvider} from '@apollo/react-components';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

describe('EventChip', () => {
	afterEach(cleanup);

	it('render', () => {
		const {container} = render(
			<ApolloProvider client={client}>
				<Provider store={mockStore()}>
					<EventChip event={{name: 'View Article'}} />
				</Provider>
			</ApolloProvider>
		);

		expect(container).toMatchSnapshot();
	});
});
