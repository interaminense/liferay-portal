import React from 'react';
import TableData from '../TableData';
import {BrowserRouter} from 'react-router';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

describe('TableData', () => {
	it('should render', () => {
		const {container} = render(<TableData />);

		expect(container).toMatchSnapshot();
	});

	it('should render with Link', () => {
		const {container, getAllByText} = render(
			<BrowserRouter>
				<TableData title='My Title' url='foo/bar' />
			</BrowserRouter>
		);

		expect(container.querySelector('a')).toHaveAttribute(
			'href',
			'/foo/bar'
		);
		expect(getAllByText('My Title')).toBeTruthy();
	});

	it('should render with Empty message', () => {
		const {container, getByText} = render(
			<TableData emptyMessage='Empty Message' />
		);

		expect(container.querySelector('.text-secondary')).toBeTruthy();
		expect(getByText('Empty Message')).toBeTruthy();
	});
});
