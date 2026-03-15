import ListComponent from '../ListComponent';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('ListComponent', () => {
	afterEach(cleanup);

	it('renders', () => {
		const {container} = render(
			<BrowserRouter>
				<ListComponent items={[]} total={0} />
			</BrowserRouter>
		);

		expect(container).toMatchSnapshot();
	});
});
