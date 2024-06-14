import React from 'react';
import TooltipTemplate from '../TooltipTemplate';
import {cleanup, render} from '@testing-library/react';

jest.unmock('react-dom');

describe('TooltipTemplate', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<TooltipTemplate children='TooltipTemplate' />
		);

		expect(container).toMatchSnapshot();
	});
});

describe('TooltipTemplate.Body', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<TooltipTemplate.Body children='Body' />);

		expect(container).toMatchSnapshot();
	});
});

describe('TooltipTemplate.Column', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<TooltipTemplate.Column children='Column' />
		);

		expect(container).toMatchSnapshot();
	});

	it('should render as truncated', () => {
		const {container} = render(
			<TooltipTemplate.Column children='Column' truncated />
		);

		expect(container).toMatchSnapshot();
	});

	it('should render w/ right alignment', () => {
		const {container} = render(
			<TooltipTemplate.Column alignment='right' children='Column' />
		);

		expect(container).toMatchSnapshot();
	});

	it('should render w/ weight of light', () => {
		const {container} = render(
			<TooltipTemplate.Column children='Column' weight='light' />
		);

		expect(container).toMatchSnapshot();
	});
});

describe('TooltipTemplate.Header', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<TooltipTemplate.Header children='Header' />
		);

		expect(container).toMatchSnapshot();
	});
});

describe('TooltipTemplate.Row', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(<TooltipTemplate.Row children='Row' />);

		expect(container).toMatchSnapshot();
	});
});
