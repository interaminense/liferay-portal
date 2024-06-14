import NumberBreakdown from '../NumberBreakdown';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('NumberBreakdown', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<NumberBreakdown onSubmit={jest.fn()} />);

		expect(container).toMatchSnapshot();
	});
});
