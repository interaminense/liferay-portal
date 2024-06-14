import * as data from 'test/data';
import client from 'shared/apollo/client';
import Overview from '../Overview';
import React from 'react';
import {Account} from 'shared/util/records';
import {ApolloProvider} from '@apollo/react-components';
import {cleanup, render} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {mockInterestsReq} from 'test/graphql-data';
import {StaticRouter} from 'react-router';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.unmock('react-dom');

describe('AccountOverview', () => {
	afterEach(cleanup);

	it('should render', async () => {
		const {container} = render(
			<ApolloProvider client={client}>
				<StaticRouter>
					<MockedProvider mocks={[mockInterestsReq()]}>
						<Overview
							account={data.getImmutableMock(
								Account,
								data.mockAccount
							)}
							channelId='123'
							groupId='456'
							id='test'
						/>
					</MockedProvider>
				</StaticRouter>
			</ApolloProvider>
		);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});
