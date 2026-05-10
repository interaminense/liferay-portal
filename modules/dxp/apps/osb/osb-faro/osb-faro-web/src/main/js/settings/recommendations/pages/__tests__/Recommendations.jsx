import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import RecommendationListQuery from '../../queries/RecommendationListQuery';
import Recommendations from '../Recommendations';
import {InMemoryCache} from '@apollo/client';
import {MockedProvider} from '@apollo/client/testing';
import {mockJobBag} from 'test/graphql-data';
import {Provider} from 'react-redux';
import {range} from 'lodash';
import {render} from '@testing-library/react';
import {Routes} from 'shared/util/router';
import {waitForLoadingToBeRemoved} from 'test/helpers';
import {withDataRouter} from 'test/mock-router';

jest.unmock('react-dom');

const mockRecommendationListReq = () => ({
	request: {
		query: RecommendationListQuery,
		variables: {
			keywords: '',
			size: 10,
			sort: {column: 'name', type: 'DESC'},
			start: 0
		}
	},
	result: {
		data: mockJobBag(range(10).map(i => data.mockRecommendationJob(i)))
	}
});

const defaultProps = {
	router: {params: {groupId: '23'}, query: {delta: '10', page: '1'}}
};

const DefaultComponent = props => (
	<Provider store={mockStore()}>
		{withDataRouter(
			<MockedProvider
				cache={
					new InMemoryCache({
						addTypename: false,
						freezeResults: false
					})
				}
				mocks={[mockRecommendationListReq()]}
			>
				<Recommendations {...defaultProps} {...props} />
			</MockedProvider>,
			{
				initialEntries: [
					'/workspace/23/settings/recommendations?delta=10&page=1&sortOrder=DESC&field=name'
				],
				path: Routes.SETTINGS_RECOMMENDATIONS
			}
		)}
	</Provider>
);

describe('Recommendations', () => {
	it('should render', async () => {
		const {container} = render(<DefaultComponent />);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});
