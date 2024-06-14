import mockStore from 'test/mock-store';
import React from 'react';
import WorkspacesSuccessDisplay from '../SuccessDisplay';
import {cleanup, render} from '@testing-library/react';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

describe('WorkspacesSuccessDisplay', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<Provider store={mockStore()}>
				<WorkspacesSuccessDisplay friendlyURL='/fooFriendlyUrl' />
			</Provider>
		);

		expect(container).toMatchSnapshot();
	});
});
