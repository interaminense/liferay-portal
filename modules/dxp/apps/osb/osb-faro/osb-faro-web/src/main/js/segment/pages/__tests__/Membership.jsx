import * as data from 'test/data';
import Membership, {MembershipChart} from '../Membership';
import mockStore from 'test/mock-store';
import React from 'react';
import {BrowserRouter} from 'react-router';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {Segment} from 'shared/util/records';
import {SegmentTypes} from 'shared/util/constants';
import {waitForLoadingToBeRemoved} from 'test/helpers';

jest.unmock('react-dom');

const defaultProps = {
	channelId: '123',
	groupId: '23',
	growthHistory: {data: []},
	id: '321',
	segment: data.getImmutableMock(Segment, data.mockSegment),
	segmentType: SegmentTypes.Batch,
	timeZoneId: 'UTC'
};

describe('Membership', () => {
	const WrappedComponent = props => (
		<Provider store={mockStore()}>
			<BrowserRouter>
				<Membership {...defaultProps} {...props} />
			</BrowserRouter>
		</Provider>
	);

	it('should render', async () => {
		const {container} = render(<WrappedComponent />);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});

describe('MembershipChart', () => {
	const WrappedComponent = props => (
		<BrowserRouter>
			<MembershipChart {...defaultProps} {...props} />
		</BrowserRouter>
	);

	it('should render', async () => {
		const {container} = render(<WrappedComponent />);

		jest.runAllTimers();

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});
