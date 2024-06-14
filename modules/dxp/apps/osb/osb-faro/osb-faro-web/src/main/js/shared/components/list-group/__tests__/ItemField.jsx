import ItemField from '../ItemField';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('ItemField', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<ItemField />);

		expect(container).toMatchSnapshot();
	});
});
