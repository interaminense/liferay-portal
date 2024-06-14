import mockStore from 'test/mock-store';
import NewRuleModal from '../NewRuleModal';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {mockRecommendationPageAssetsReq} from 'test/graphql-data';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

describe('NewRuleModal', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<MockedProvider mocks={[mockRecommendationPageAssetsReq([])]}>
				<Provider store={mockStore()}>
					<NewRuleModal />
				</Provider>
			</MockedProvider>
		);

		jest.runAllTimers();

		expect(container).toMatchSnapshot();
	});
});
