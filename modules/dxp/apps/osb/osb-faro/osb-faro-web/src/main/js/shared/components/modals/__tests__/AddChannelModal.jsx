import AddChannelModal from '../AddChannelModal';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';
import {noop} from 'lodash';

jest.unmock('react-dom');

describe('AddChannelModal', () => {
	afterEach(cleanup);

	it('renders', () => {
		const {container} = render(
			<BrowserRouter>
				<AddChannelModal onClose={noop} onSubmit={noop} />
			</BrowserRouter>
		);

		expect(container).toMatchSnapshot();
	});
});
