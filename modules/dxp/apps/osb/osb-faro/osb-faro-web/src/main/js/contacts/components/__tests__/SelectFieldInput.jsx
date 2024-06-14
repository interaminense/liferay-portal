import React from 'react';
import SelectFieldInput from '../SelectFieldInput';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('SelectFieldInput', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<SelectFieldInput groupId='23' />);

		expect(container).toMatchSnapshot();
	});
});
