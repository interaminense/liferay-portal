import BaseDropdown from '../index';
import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('BaseDropdown', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container, getByTestId} = render(
			<BaseDropdown
				onActiveChange={jest.fn()}
				trigger={<button data-testid='target'>{'click me'}</button>}
			>
				{() => <div>{'Child contents'}</div>}
			</BaseDropdown>
		);

		fireEvent.click(getByTestId('target'));

		jest.runAllTimers();
		expect(container).toMatchSnapshot();

		const dropdownMenu = document.body.getElementsByClassName(
			'event-analysis-dropdown-menu-root'
		)[0];

		expect(dropdownMenu).toMatchSnapshot();
	});
});
