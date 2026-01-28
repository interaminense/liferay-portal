import ConnectDXPModal from '../ConnectDXPModal';
import mockStore from 'test/mock-store';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';
import {noop} from 'lodash';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

describe('ConnectDXPModal', () => {
	afterEach(cleanup);

	it('renders', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<BrowserRouter>
					<ConnectDXPModal groupId='123' onClose={noop} />
				</BrowserRouter>
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
