import AccountNames from '../AccountNames';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

const tableRow = document.createElement('tr');

describe('AccountNames', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<AccountNames
				data={{
					accountNames: ['foo', 'bar', 'baz']
				}}
			/>,
			{container: document.body.appendChild(tableRow)}
		);

		expect(container).toMatchSnapshot();
	});

	it('should render a fallback display', () => {
		const {getByText} = render(
			<AccountNames
				data={{
					accountNames: []
				}}
			/>,
			{container: document.body.appendChild(tableRow)}
		);

		expect(getByText('-')).toBeTruthy();
	});
});
