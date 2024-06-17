import InterestPagesList from '../InterestPagesList';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {StaticRouter} from 'react-router';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.unmock('react-dom');

/**
 * For ActivePagesList (active: true) validation, It's possible to order by
 * unique visits count, whereas for InactivePagesList (active: false)
 * it's not, that's why we're validating by the presence
 * of the order button on those tests.
 */
describe('InterestPagesList', () => {
	afterEach(cleanup);

	it('should render', async () => {
		const {container} = render(
			<StaticRouter>
				<InterestPagesList
					channelId='456'
					dataSourceParams={{active: true}}
					groupId='123'
				/>
			</StaticRouter>
		);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});
