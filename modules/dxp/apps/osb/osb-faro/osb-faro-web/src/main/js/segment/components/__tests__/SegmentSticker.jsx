import React from 'react';
import SegmentSticker from '../SegmentSticker';
import {cleanup, render} from '@testing-library/react';
import {SegmentStates, SegmentTypes} from 'shared/util/constants';

jest.unmock('react-dom');

describe('SegmentSticker', () => {
	afterEach(cleanup);

	it('should render', () => {
		const {container} = render(
			<SegmentSticker segmentType={SegmentTypes.Static} />
		);
		expect(container).toMatchSnapshot();
	});

	it('should render with a dynamic segment icon', () => {
		const {container} = render(
			<SegmentSticker segmentType={SegmentTypes.Dynamic} />
		);

		expect(container.querySelector('use')).toHaveAttribute(
			'href',
			'#individual-dynamic-segment'
		);
	});

	it('should render with a disabled segment icon', () => {
		const {container} = render(
			<SegmentSticker state={SegmentStates.Disabled} />
		);

		expect(container.querySelector('use')).toHaveAttribute(
			'href',
			'#warning'
		);
	});
});
