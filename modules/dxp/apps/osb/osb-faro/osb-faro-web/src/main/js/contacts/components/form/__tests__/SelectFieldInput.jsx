import * as data from 'test/data';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {FormSelectFieldInput} from '../SelectFieldInput';

jest.unmock('react-dom');

describe('SelectFieldInput', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<FormSelectFieldInput
				field={{name: 'foo'}}
				form={data.mockForm()}
				groupId='23'
				name='foo'
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render with a label', () => {
		const label = 'bar';

		const {getByText} = render(
			<FormSelectFieldInput
				field={{name: 'foo'}}
				form={data.mockForm()}
				groupId='23'
				label={label}
				name='foo'
			/>
		);

		expect(getByText(label)).toBeTruthy();
	});
});
