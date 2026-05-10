import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import {ClearData} from '../ClearData';
import {DataSource} from 'shared/util/records';
import {MockedProvider} from '@apollo/client/testing';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import {waitForLoadingToBeRemoved} from 'test/helpers';
import {withDataRouter} from 'test/mock-router';

jest.unmock('react-dom');

const defaultProps = {
	addAlert: jest.fn(),
	dataSource: new DataSource(data.mockLiferayDataSource()),
	entitiesCount: 10,
	groupId: '23',
	history: {push: jest.fn()},
	id: '26'
};

const WrappedComponent = props => (
	<Provider store={mockStore()}>
		{withDataRouter(
			<MockedProvider>
				<ClearData {...defaultProps} {...props} />
			</MockedProvider>,
			{
				initialEntries: [
					'/workspace/23/settings/data-source/26/clear-data'
				],
				path: '/workspace/:groupId/settings/data-source/:id/clear-data'
			}
		)}
	</Provider>
);

describe('ClearData', () => {
	it('should render', async () => {
		const {container} = render(<WrappedComponent />);

		await waitForLoadingToBeRemoved(container);

		expect(container).toMatchSnapshot();
	});
});
