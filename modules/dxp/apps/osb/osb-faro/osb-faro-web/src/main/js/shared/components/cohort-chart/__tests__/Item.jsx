import Item from '../Item';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('CohortChartItem', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<Item
				colorHex='#000000'
				date='February 20, 2010'
				dateLabelFn={date => date}
				period='Day 3'
				retention={36.21231231231}
				value={123}
			/>
		);

		expect(container).toMatchSnapshot();
	});
});
