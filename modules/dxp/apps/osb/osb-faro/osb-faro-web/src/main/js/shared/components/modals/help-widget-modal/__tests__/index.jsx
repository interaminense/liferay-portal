import HelpWidgetModal from '../index';
import mockStore from 'test/mock-store';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

describe('HelpWidgetModal', () => {
	afterEach(cleanup);

	it('Should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<HelpWidgetModal onClose={jest.fn()} />
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
