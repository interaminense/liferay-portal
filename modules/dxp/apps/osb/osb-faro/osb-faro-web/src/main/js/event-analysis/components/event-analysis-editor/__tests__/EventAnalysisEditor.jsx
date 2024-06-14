import client from 'shared/apollo/client';
import EventAnalysisEditor from '../index';
import mockStore from 'test/mock-store';
import React from 'react';
import {ApolloProvider} from '@apollo/react-components';
import {CalculationTypes} from 'event-analysis/utils/types';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

describe('Event Analysis Editor', () => {
	afterEach(cleanup);

	it('render', () => {
		const {container} = render(
			<ApolloProvider client={client}>
				<Provider store={mockStore()}>
					<EventAnalysisEditor type={CalculationTypes.Total} />
				</Provider>
			</ApolloProvider>
		);

		expect(container).toMatchSnapshot();
	});
});
