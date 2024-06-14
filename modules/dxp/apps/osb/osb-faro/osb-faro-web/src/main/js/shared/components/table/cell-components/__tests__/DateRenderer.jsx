import DateRenderer from '../DateRenderer';
import moment from 'moment';
import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {getTimestamp} from 'test/data';

jest.unmock('react-dom');

describe('DateRenderer', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<DateRenderer
				data={{
					dateCreated: getTimestamp()
				}}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render with date provided in the datePath String', () => {
		const {container} = render(
			<DateRenderer
				data={{
					dateCreated: 0,
					dateUpdated: getTimestamp()
				}}
				datePath='dateUpdated'
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('should render with date provided in the datePath Array', () => {
		const {container} = render(
			<DateRenderer
				data={{
					properties: {
						dateAdded: getTimestamp(),
						dateCreated: 0
					}
				}}
				datePath={['properties', 'dateAdded']}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('should use a custom date formatter', () => {
		const {container} = render(
			<DateRenderer
				data={{
					dateCreated: getTimestamp()
				}}
				dateFormatter={date => moment(date).format('YYYY MMMM DD')}
			/>
		);

		expect(container).toMatchSnapshot();
	});
});
