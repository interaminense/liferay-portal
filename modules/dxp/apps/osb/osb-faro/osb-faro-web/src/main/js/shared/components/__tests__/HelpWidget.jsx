import HelpWidget from '../HelpWidget';
import mockStore from 'test/mock-store';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

describe('HelpWidget', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<HelpWidget />
			</Provider>
		);
		expect(container).toMatchSnapshot();
	});

	it('should render a dropdown', () => {
		const {getByText} = render(
			<Provider store={mockStore()}>
				<HelpWidget />
			</Provider>
		);
		expect(getByText('Report an Issue')).toBeTruthy();
	});
});
