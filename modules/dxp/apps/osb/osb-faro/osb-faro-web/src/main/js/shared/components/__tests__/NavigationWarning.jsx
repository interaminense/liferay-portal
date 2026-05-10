import mockStore from 'test/mock-store';
import NavigationWarning from '../NavigationWarning';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';
import {withDataRouter} from 'test/mock-router';

jest.unmock('react-dom');

describe('NavigationWarning', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				{withDataRouter(<NavigationWarning when />)}
			</Provider>
		);

		expect(container).toBeTruthy();
	});
});
