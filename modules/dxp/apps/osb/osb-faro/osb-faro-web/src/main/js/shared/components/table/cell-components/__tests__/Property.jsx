import PropertyCell from '../Property';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('PropertyCell', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<PropertyCell
				data={{
					name: 'email',
					value: 'TestTest@liferay.com'
				}}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render - when has no value', () => {
		const {getByText} = render(
			<PropertyCell
				data={{
					name: 'email',
					value: ''
				}}
			/>
		);

		expect(getByText('-')).toBeTruthy();
	});
});
