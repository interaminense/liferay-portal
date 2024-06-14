import DataSourceStatus from '../DataSourceStatus';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('DataSourceStatus', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<DataSourceStatus display='info' label='foo' message='bar' />
		);

		expect(container).toMatchSnapshot();
	});
});
