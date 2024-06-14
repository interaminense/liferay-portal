import ItemTitle from '../ItemTitle';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('ItemTitle', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<ItemTitle />);

		expect(container).toMatchSnapshot();
	});

	it('should render with children', () => {
		const stringToMatch = 'Item title text';

		const {queryByText} = render(
			<ItemTitle>
				<span>{stringToMatch}</span>
			</ItemTitle>
		);

		expect(queryByText(stringToMatch)).toBeTruthy();
	});
});
