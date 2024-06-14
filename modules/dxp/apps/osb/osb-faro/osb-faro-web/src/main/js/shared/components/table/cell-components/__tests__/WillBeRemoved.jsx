import React from 'react';
import WillBeRemovedCell from '../WillBeRemoved';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('WillBeRemovedCell', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<WillBeRemovedCell
				data={{
					dataSourceIndividualPKs: []
				}}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render as will be removed', () => {
		const {container} = render(
			<WillBeRemovedCell
				data={{
					dataSourceIndividualPKs: ['test']
				}}
			/>
		);

		expect(container).toMatchSnapshot();
	});
});
