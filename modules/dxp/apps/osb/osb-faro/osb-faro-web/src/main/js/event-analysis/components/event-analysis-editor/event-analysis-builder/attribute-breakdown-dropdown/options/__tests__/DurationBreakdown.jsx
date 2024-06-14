import DurationBreakdown from '../DurationBreakdown';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('DurationBreakdown', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<DurationBreakdown onSubmit={jest.fn()} />);

		expect(container).toMatchSnapshot();
	});
});
