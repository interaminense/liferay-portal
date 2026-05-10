import * as data from 'test/data';
import AssociatedSegmentsList from '../AssociatedSegmentsList';
import mockStore from 'test/mock-store';
import React from 'react';
import {fromJS} from 'immutable';
import {Project} from 'shared/util/records';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {withDataRouter} from 'test/mock-router';

jest.unmock('react-dom');

const defaultProps = {
	project: new Project(
		data.mockProject(23, {
			faroSubscription: fromJS(data.mockSubscription())
		})
	)
};

const WrappedComponent = () => (
	<Provider store={mockStore()}>
		{withDataRouter(
			<AssociatedSegmentsList
				channelId='123123'
				dataSourceFn={() => Promise.resolve({})}
				groupId='23'
				id='test'
				total={2}
			/>
		)}
	</Provider>
);

describe('AssociatedSegmentsList', () => {
	it('should render', () => {
		const {container} = render(<WrappedComponent {...defaultProps} />);

		expect(container).toMatchSnapshot();
	});
});
