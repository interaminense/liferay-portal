import mockStore from 'test/mock-store';
import React from 'react';
import {BasePage} from '../index';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';
import {StaticRouter} from 'react-router';

jest.unmock('react-dom');

describe('BasePage', () => {
	afterEach(cleanup);

	it('renders BasePage', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<StaticRouter>
					<BasePage documentTitle='Test title'>
						{'Test test'}
					</BasePage>
				</StaticRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
