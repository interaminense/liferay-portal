import FilterInfo from '../FilterInfo';
import React from 'react';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('FilterInfo', () => {
	afterEach(cleanup);

	it('render', () => {
		const {container} = render(
			<FilterInfo
				dataType='STRING'
				description='Test description'
				name='Test Name'
				onEditClick={jest.fn()}
				showDescription
			/>
		);

		expect(container.querySelector('.description')).toBeTruthy();
		expect(container.querySelector('.label-root')).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it('render w/o info', () => {
		const {container} = render(
			<FilterInfo
				dataType='STRING'
				description='Test description'
				name='Test Name'
				onEditClick={jest.fn()}
			/>
		);

		expect(container.querySelector('.description')).toBeNull();
	});

	it('render w/o dataType', () => {
		const {container} = render(
			<FilterInfo
				description='Test description'
				name='Test Name'
				onEditClick={jest.fn()}
				showDescription
			/>
		);

		expect(container.querySelector('.label-root')).toBeNull();
	});
});
