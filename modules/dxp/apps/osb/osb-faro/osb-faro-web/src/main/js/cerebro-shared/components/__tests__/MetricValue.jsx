import MetricValue from '../MetricValue';
import React from 'react';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

describe('MetricValue', () => {
	it('should render the component', () => {
		const {container} = render(<MetricValue value='100K' />);

		expect(container).toMatchSnapshot();
	});

	it('should render the component with number type', () => {
		const {container} = render(<MetricValue type='number' value='100K' />);

		expect(container).toMatchSnapshot();
	});

	it('should render the component with percentage ', () => {
		const {container} = render(
			<MetricValue type='percentage' value='100%' />
		);

		expect(container).toMatchSnapshot();
	});

	it('should render the component with time ', () => {
		const {container} = render(<MetricValue type='time' value='12m 40s' />);

		expect(container).toMatchSnapshot();
	});

	it('should render the component with ratings ', () => {
		const {container} = render(
			<MetricValue type='ratings' value='10/10' />
		);

		expect(container).toMatchSnapshot();
	});
});
