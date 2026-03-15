import NavigationWarning from '../NavigationWarning';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('NavigationWarning', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<BrowserRouter>
				<NavigationWarning when />
			</BrowserRouter>
		);

		expect(container).toBeTruthy();
	});
});
