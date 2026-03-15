import client from 'shared/apollo/client';
import DateTimeInput from '../DateTimeInput';
import React from 'react';
import {ApolloProvider} from '@apollo/client/react';
import {cleanup, render} from '@testing-library/react';
import {MockedProvider} from '@apollo/client/testing/react';
import {mockPreferenceReq} from 'test/graphql-data';
import {Property} from 'shared/util/records';

jest.unmock('react-dom');

describe('DateTimeInput', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<ApolloProvider client={client}>
				<MockedProvider mocks={[mockPreferenceReq()]}>
					<DateTimeInput
						displayValue='Start Date Time'
						operatorRenderer={() => <div>{'operator'}</div>}
						property={new Property()}
						value='2012-12-12T00:00:00.000Z'
					/>
				</MockedProvider>
			</ApolloProvider>
		);

		expect(container).toMatchSnapshot();
	});
});
