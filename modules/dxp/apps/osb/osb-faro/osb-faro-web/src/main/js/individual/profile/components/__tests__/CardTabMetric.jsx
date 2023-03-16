import CardTabMetric from '../CardTabMetric';
import React from 'react';
import {render} from '@testing-library/react';
import {StaticRouter} from 'react-router';

jest.unmock('react-dom');

describe('CardTabMetric', () => {
	it('should render', () => {
		const {container} = render(
			<StaticRouter>
				<CardTabMetric change={2} type='number' value={10} />
			</StaticRouter>
		);

		jest.runAllTimers();

		expect(container).toMatchSnapshot();
	});

	it('should render in a give format type', () => {
		const {container} = render(
			<StaticRouter>
				<CardTabMetric change={2} type='ratings' value={0.85} />
			</StaticRouter>
		);

		jest.runAllTimers();

		expect(container).toMatchSnapshot();
	});
});
