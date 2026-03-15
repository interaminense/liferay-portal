import mockStore from 'test/mock-store';
import React from 'react';
import {BasePage} from '../index';
import {BrowserRouter} from 'react-router';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

describe('BasePage', () => {
	it('renders BasePage', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<BasePage documentTitle='Test title'>
						{'Test test'}
					</BasePage>
				</BrowserRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
