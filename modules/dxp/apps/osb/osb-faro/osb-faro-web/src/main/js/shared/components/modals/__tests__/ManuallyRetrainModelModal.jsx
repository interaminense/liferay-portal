import ManuallyRetrainModelModal from '../ManuallyRetrainModelModal';
import React from 'react';
import RecommendationJobRunsMonthlyStatisticsQuery from 'settings/recommendations/queries/RecommendationJobRunsMonthlyStatisticsQuery';
import {cleanup, render} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {mockRecommendationJobRunsMonthlyStatistics} from 'test/data';
import {waitForLoading} from 'test/helpers';

function mockRecommendationJobRunsMonthlyStatisticsReq() {
	return {
		request: {
			query: RecommendationJobRunsMonthlyStatisticsQuery,
			variables: {
				jobId: '321'
			}
		},
		result: {
			data: {
				jobRunsMonthlyStatistics: {
					__typename: 'JobRunsMonthlyStatistics',
					...mockRecommendationJobRunsMonthlyStatistics()
				}
			}
		}
	};
}

jest.unmock('react-dom');

describe('ManuallyRetrainModelModal', () => {
	afterEach(cleanup);

	it('should render', async () => {
		const {container} = render(
			<MockedProvider
				mocks={[mockRecommendationJobRunsMonthlyStatisticsReq()]}
			>
				<ManuallyRetrainModelModal job={{id: '321'}} />
			</MockedProvider>
		);

		await waitForLoading(container);

		jest.runAllTimers();

		expect(container).toMatchSnapshot();
	});
});
