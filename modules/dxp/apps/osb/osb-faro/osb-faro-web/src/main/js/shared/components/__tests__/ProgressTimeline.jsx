import ProgressTimeline from '../ProgressTimeline';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('ProgressTimeline', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<BrowserRouter>
				<ProgressTimeline
					activeIndex={1}
					items={[
						{
							title: 'This is a really long title for this step'
						},
						{title: 'Step 2'},
						{title: 'Step 3'},
						{title: 'Step 4'}
					]}
				/>
			</BrowserRouter>
		);

		expect(container).toMatchSnapshot();
	});
});
