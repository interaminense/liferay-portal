import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {Label} from '../Label';

jest.unmock('react-dom');

describe('Label', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<Label label='Label' />);

		expect(container).toMatchSnapshot();
	});
});
