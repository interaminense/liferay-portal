import AssociatedSegmentsList from '../AssociatedSegmentsList';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

describe('AssociatedSegmentsList', () => {
	it('should render', () => {
		const {container} = render(
			<BrowserRouter>
				<AssociatedSegmentsList
					channelId='123123'
					dataSourceFn={() => Promise.resolve({})}
					groupId='23'
					id='test'
					total={2}
				/>
			</BrowserRouter>
		);

		expect(container).toMatchSnapshot();
	});
});
