import Label from '../Label';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('Label', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<Label />);

		expect(container).toMatchSnapshot();
	});

	it('should render as required', () => {
		const {container} = render(<Label required />);

		expect(container.querySelector('.required')).toBeTruthy();
	});

	it('should render with a popover component', () => {
		const {container} = render(<Label info='foo bar baz' />);

		expect(container.querySelector('.info-popover-root')).toBeTruthy;
	});
});
