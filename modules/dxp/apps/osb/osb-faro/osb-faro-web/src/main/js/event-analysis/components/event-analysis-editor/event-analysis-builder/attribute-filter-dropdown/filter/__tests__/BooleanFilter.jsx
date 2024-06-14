import BooleanFilter from '../BooleanFilter';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('BooleanFilter', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<BooleanFilter onSubmit={jest.fn()} />);

		expect(container).toMatchSnapshot();
	});
});
