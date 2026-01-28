import MatchingPagesModal from '../MatchingPagesModal';
import mockStore from 'test/mock-store';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {MockedProvider} from '@apollo/react-testing';
import {mockRecommendationPageAssetsReq} from 'test/graphql-data';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {waitForLoading} from 'test/helpers';

jest.unmock('react-dom');

describe('MatchingPagesModal', () => {
	it('should render', async () => {
		const {container} = render(
			<BrowserRouter>
				<MockedProvider mocks={[mockRecommendationPageAssetsReq([])]}>
					<Provider store={mockStore()}>
						<MatchingPagesModal
							itemFilters={[
								{
									name: 'includeFilter',
									value: '.*custom-assets'
								}
							]}
						/>
					</Provider>
				</MockedProvider>
			</BrowserRouter>
		);

		await waitForLoading(container);

		jest.runAllTimers();

		expect(container).toMatchSnapshot();
	});
});
