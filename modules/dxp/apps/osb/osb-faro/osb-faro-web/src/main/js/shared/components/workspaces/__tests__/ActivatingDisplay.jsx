import ActivatingDisplay from '../ActivatingDisplay';
import mockStore from 'test/mock-store';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

describe('ActivatingDisplay', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<ActivatingDisplay groupId='123123' />
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
