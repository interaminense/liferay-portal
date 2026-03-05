import React from 'react';
import SourceCell from '../Source';
import {BrowserRouter} from 'react-router';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('SourceCell', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<BrowserRouter>
				<SourceCell
					data={{
						dataSourceId: '456',
						dataSourceName: 'Test Data Source'
					}}
					groupId='123'
				/>
			</BrowserRouter>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render without an href', () => {
		const {container} = render(
			<BrowserRouter>
				<SourceCell
					data={{
						dataSourceName: 'Test Data Source'
					}}
					groupId='123'
				/>
			</BrowserRouter>
		);

		expect(container.querySelector('a')).toBeNull();
	});
});
